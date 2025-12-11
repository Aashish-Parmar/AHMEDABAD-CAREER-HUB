import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";

const ManageApplicationsPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobIdParam = searchParams.get("jobId");

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState(jobIdParam || "");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (user?.role !== "recruiter") {
      toast.error("Only recruiters can access this page");
      navigate("/dashboard");
      return;
    }

    fetchJobs();
  }, [token, user]);

  useEffect(() => {
    if (selectedJobId) {
      fetchJobApplications(selectedJobId, currentPage);
    } else {
      fetchCompanyApplications(currentPage);
    }
  }, [selectedJobId, currentPage, statusFilter, token]);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs?page=1&limit=1000", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const jobsData = Array.isArray(res.data) ? res.data : res.data.jobs || [];
      const companyJobs = jobsData.filter(
        (job) => job.company?._id === user.company
      );
      setJobs(companyJobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const fetchJobApplications = async (jobId, page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (statusFilter) params.append("status", statusFilter);

      const res = await api.get(`/applications/job/${jobId}?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.applications || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error("Error fetching applications:", err);
      toast.error("Failed to load applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyApplications = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (statusFilter) params.append("status", statusFilter);
      if (selectedJobId) params.append("jobId", selectedJobId);

      const res = await api.get(`/applications/company?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.applications || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error("Error fetching applications:", err);
      toast.error("Failed to load applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    const loadingToast = toast.loading("Updating application status...");
    try {
      const res = await api.patch(
        `/applications/${applicationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      toast.success("Application status updated successfully", {
        id: loadingToast,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status", {
        id: loadingToast,
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: "bg-blue-100 text-blue-800",
      reviewed: "bg-yellow-100 text-yellow-800",
      shortlisted: "bg-purple-100 text-purple-800",
      rejected: "bg-red-100 text-red-800",
      hired: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = [
      "applied",
      "reviewed",
      "shortlisted",
      "rejected",
      "hired",
    ];
    return allStatuses.filter((s) => s !== currentStatus);
  };

  if (user?.role !== "recruiter") {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Applications</h2>
          <Link to="/recruiter-dashboard">
            <Button className="bg-gray-500 hover:bg-gray-600">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Job
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => {
                setSelectedJobId(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Jobs</option>
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No applications found.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {applications.map((app) => (
                <Card
                  key={app._id}
                  className="p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {app.user?.avatarUrl ? (
                          <img
                            src={app.user.avatarUrl}
                            alt={app.user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            {app.user?.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-lg">
                            {app.user?.name || "Unknown"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {app.user?.email}
                          </p>
                          {app.user?.college && (
                            <p className="text-xs text-gray-500">
                              📚 {app.user.college}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="ml-16 mb-2">
                        <p className="text-sm font-semibold text-gray-700">
                          Applied for:{" "}
                          <Link
                            to={`/jobs/${app.job?._id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {app.job?.title}
                          </Link>
                        </p>
                        <p className="text-xs text-gray-500">
                          Applied on:{" "}
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)}
                      </span>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-600">
                          Update Status:
                        </label>
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusUpdate(app._id, e.target.value)
                          }
                          className="text-xs border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value={app.status}>{app.status}</option>
                          {getStatusOptions(app.status).map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages || 1}
                totalItems={pagination.totalItems || applications.length}
                itemsPerPage={pagination.itemsPerPage || 10}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default ManageApplicationsPage;
