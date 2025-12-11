import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Pagination from "../components/common/Pagination";

const RecruiterDashboardPage = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchJobs(currentPage);
  }, [token, user.company, currentPage]);

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Handle both old format (array) and new format (object with jobs and pagination)
      const jobsData = Array.isArray(res.data) ? res.data : res.data.jobs || [];
      // Filter by company on client side (backend should ideally do this)
      const filteredJobs = jobsData.filter(
        (job) => job.company?._id === user.company
      );
      setJobs(filteredJobs);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error("Error fetching jobs:", err);
      toast.error("Failed to load jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    const loadingToast = toast.loading("Deleting job...");
    try {
      await api.delete(`/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((jobs) => jobs.filter((job) => job._id !== jobId));
      toast.success("Job deleted successfully", { id: loadingToast });
      // Refresh jobs if needed
      if (jobs.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchJobs(currentPage);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete job", {
        id: loadingToast,
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Check if recruiter has company linked
  const hasCompany = user?.company;

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Recruiter Dashboard</h2>
            <div className="text-gray-600">
              Logged in as: <span className="font-semibold">{user?.email}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {hasCompany && (
              <>
                <Link to="/post-job">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Post New Job
                  </Button>
                </Link>
                <Link to="/manage-applications">
                  <Button className="bg-green-500 hover:bg-green-600">
                    Manage Applications
                  </Button>
                </Link>
              </>
            )}
            <Button onClick={logout} className="bg-red-500 hover:bg-red-600">
              Log out
            </Button>
          </div>
        </div>

        {/* Company Creation Prompt */}
        {!hasCompany && (
          <div className="mb-6 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              ⚠️ Company Profile Required
            </h3>
            <p className="text-yellow-700 mb-4">
              You need to create your company profile before you can post jobs. 
              {user?.companyName && (
                <span className="block mt-1">
                  Your company name: <strong>{user.companyName}</strong>
                </span>
              )}
            </p>
            <Link to="/create-company">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Create Company Profile
              </Button>
            </Link>
          </div>
        )}

        {/* Company Info Card */}
        {hasCompany && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-blue-900">Your Company</h3>
                <p className="text-sm text-blue-700">
                  {user?.companyName || "Company linked"}
                </p>
              </div>
              <Link to="/my-company">
                <Button className="bg-blue-500 hover:bg-blue-600 text-sm">
                  Manage Company
                </Button>
              </Link>
            </div>
          </div>
        )}

        <h3 className="text-lg font-semibold mb-4">Your Job Postings</h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">
              {hasCompany 
                ? "No jobs posted yet." 
                : "Create your company profile first to post jobs."}
            </p>
            {hasCompany && (
              <Link to="/post-job">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Post Your First Job
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {jobs.map((job) => (
                <Card
                  key={job._id}
                  className="p-4 border border-blue-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-800 mb-1">
                        {job.title}
                      </h4>
                      <div className="text-sm text-gray-500 mb-2">
                        {job.jobType} | {job.location || "Ahmedabad"}
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        {job.description.length > 150
                          ? `${job.description.slice(0, 150)}...`
                          : job.description}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-xs font-semibold text-gray-600">
                          Skills:
                        </span>
                        {(job.requiredSkills || [])
                          .slice(0, 5)
                          .map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        {(job.requiredSkills || []).length > 5 && (
                          <span className="text-xs text-gray-500">
                            +{(job.requiredSkills || []).length - 5} more
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-green-600">
                        Salary/Stipend: {job.salaryStipend}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Link to={`/edit-job/${job._id}`}>
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-sm px-3 py-1">
                          Edit
                        </Button>
                      </Link>
                      <Link to={`/manage-applications?jobId=${job._id}`}>
                        <Button className="bg-green-500 hover:bg-green-600 text-sm px-3 py-1">
                          View Applications
                        </Button>
                      </Link>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-sm px-3 py-1"
                        onClick={() => handleDelete(job._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages || 1}
                totalItems={pagination.totalItems || jobs.length}
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

export default RecruiterDashboardPage;
