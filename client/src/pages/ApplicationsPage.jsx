import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Card from "../components/common/Card";
import Pagination from "../components/common/Pagination";

const styles = `
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes glowingBorder {
  0% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
  100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); }
}
.fade-in-up { animation: fadeInUp 0.6s ease-out both; }
.card-hover:hover { transform: translateY(-4px) scale(1.01); transition: all 0.3s ease-in-out; }
.glow-border { animation: glowingBorder 3s ease-in-out infinite; }
`;

const ApplicationsPage = () => {
  const { token } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const fetchApplications = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/applications/mine?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.pagination) {
        setApps(res.data.applications || []);
        setPagination(res.data.pagination);
      } else {
        // Fallback for old format
        const allApps = Array.isArray(res.data) ? res.data : (res.data.applications || []);
        setApps(allApps);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: allApps.length,
          itemsPerPage: allApps.length
        });
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      toast.error("Failed to load applications");
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(currentPage);
  }, [token, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: "bg-blue-100 text-blue-800",
      reviewed: "bg-yellow-100 text-yellow-800",
      shortlisted: "bg-purple-100 text-purple-800",
      rejected: "bg-red-100 text-red-800",
      hired: "bg-green-100 text-green-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Filter and sort applications
  const filteredAndSortedApps = [...apps]
    .filter(app => statusFilter === "all" || app.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.appliedAt) - new Date(a.appliedAt);
      } else if (sortBy === "oldest") {
        return new Date(a.appliedAt) - new Date(b.appliedAt);
      } else if (sortBy === "company") {
        return (a.job?.company?.companyName || "").localeCompare(b.job?.company?.companyName || "");
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4">
      <style>{styles}</style>

      <div className="max-w-4xl mx-auto fade-in-up">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
          📂 My Job Applications
        </h2>

        {/* Filters and Sort */}
        {apps.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
            <div className="flex gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border px-3 py-2 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="applied">Applied</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border px-3 py-2 rounded-md text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="company">Company Name</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredAndSortedApps.length} application{filteredAndSortedApps.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500 p-10">
            <div className="animate-spin inline-block h-8 w-8 border-4 border-blue-300 border-t-transparent border-solid rounded-full"></div>
            <div className="mt-3">Loading applications...</div>
          </div>
        ) : filteredAndSortedApps.length === 0 ? (
          <div className="text-center text-gray-500 mt-8 p-8 bg-white rounded-lg shadow-sm">
            {apps.length === 0 ? (
              <>
                <div className="text-4xl mb-4">📭</div>
                <div className="text-lg font-medium mb-2">No applications yet</div>
                <div className="text-sm mb-4">Start exploring jobs and apply to positions!</div>
                <Link to="/jobs" className="text-blue-600 hover:underline font-medium">
                  Browse Jobs →
                </Link>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">🔍</div>
                <div className="text-lg font-medium mb-2">No applications found</div>
                <div className="text-sm">Try changing your filters</div>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {filteredAndSortedApps.map((app) => (
                <Card
                  key={app._id}
                  className="p-5 rounded-xl border-2 border-blue-100 bg-white shadow-md card-hover glow-border"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link to={`/jobs/${app.job?._id}`}>
                          <div className="text-xl font-semibold text-blue-700 hover:underline">
                            {app.job?.title}
                          </div>
                        </Link>
                        <div className="text-sm text-gray-600 font-medium mt-1">
                          🏢 {app.job?.company?.companyName}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(app.status || "applied")}`}>
                        {app.status || "Applied"}
                      </span>
                    </div>
                    <div className="text-gray-700 text-sm">
                      {app.job?.description?.slice(0, 150)}...
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        📅 Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                      <Link 
                        to={`/jobs/${app.job?._id}`}
                        className="text-blue-600 text-sm hover:underline font-medium"
                      >
                        View Job Details →
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
