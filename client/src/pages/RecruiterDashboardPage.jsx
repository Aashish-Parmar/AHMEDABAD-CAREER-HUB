import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

const RecruiterDashboardPage = () => {
  const { user, token, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // Assuming backend filters by recruiter/company based on JWT
        const res = await api.get("/jobs", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(res.data.filter(job => job.company?._id === user.company));
      } catch (err) {
        setAlert("Could not fetch jobs.");
        setJobs([]);
      }
      setLoading(false);
    };
    fetchJobs();
  }, [token, user.company]);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(jobs => jobs.filter(job => job._id !== jobId));
      setAlert("Job deleted.");
    } catch {
      setAlert("Failed to delete job.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <Card>
        <h2 className="text-xl font-bold mb-4">Recruiter Dashboard</h2>
        <div className="mb-3 text-gray-700">
          Logged in as: <span className="font-semibold">{user?.email}</span>
        </div>
        <div className="text-right mb-4">
          <Button onClick={logout} className="bg-red-500 hover:bg-red-600">Log out</Button>
        </div>
        <h3 className="text-lg font-semibold mb-2">Your Job Postings</h3>
        {loading ? (
          <div>Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div>No jobs posted yet.</div>
        ) : (
          jobs.map(job => (
            <Card key={job._id} className="mb-3 border-blue-100">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">{job.title}</span>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-sm px-2 py-1"
                  onClick={() => handleDelete(job._id)}
                >
                  Delete
                </Button>
              </div>
              <div className="text-xs text-gray-500">
                {job.jobType} | {job.location || "Ahmedabad"}
              </div>
              <div className="my-1 text-gray-700">{job.description.slice(0, 90)}...</div>
              <div className="text-xs">
                Skills: {(job.requiredSkills || []).join(", ")}
              </div>
              <div className="text-xs">Salary/Stipend: {job.salaryStipend}</div>
            </Card>
          ))
        )}
        {alert && <div className="text-green-700 mt-2">{alert}</div>}
      </Card>
      {/* Future: Add analytics, view applicants, create job UI */}
    </div>
  );
};

export default RecruiterDashboardPage;
