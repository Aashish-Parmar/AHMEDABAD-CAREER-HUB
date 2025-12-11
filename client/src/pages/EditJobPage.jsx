import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const EditJobPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    jobType: "internship",
    salaryStipend: "",
    location: "Ahmedabad",
    requiredSkills: "",
  });

  useEffect(() => {
    if (user?.role !== "recruiter") {
      toast.error("Only recruiters can edit jobs");
      navigate("/dashboard");
      return;
    }

    fetchJob();
  }, [id, token]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Verify job belongs to recruiter's company
      if (res.data.company?._id !== user.company) {
        toast.error("You can only edit jobs for your company");
        navigate("/recruiter-dashboard");
        return;
      }

      setForm({
        title: res.data.title || "",
        description: res.data.description || "",
        jobType: res.data.jobType || "internship",
        salaryStipend: res.data.salaryStipend || "",
        location: res.data.location || "Ahmedabad",
        requiredSkills: (res.data.requiredSkills || []).join(", "),
      });
    } catch (err) {
      console.error("Error fetching job:", err);
      toast.error("Failed to load job details");
      navigate("/recruiter-dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating job...");
    try {
      const payload = {
        ...form,
        requiredSkills: form.requiredSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await api.patch(`/jobs/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Job updated successfully!", { id: loadingToast });
      setTimeout(() => navigate("/recruiter-dashboard"), 1000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to update job. Please try again.";
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto mt-10">
        <Card>
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading job details...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (user?.role !== "recruiter") {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 px-4">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Job</h2>
          <Link to="/recruiter-dashboard">
            <Button className="bg-gray-500 hover:bg-gray-600 text-sm">
              Cancel
            </Button>
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <label className="block mb-1 font-medium text-gray-700">Type</label>
          <select
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="internship">Internship</option>
            <option value="full-time">Full-Time</option>
          </select>
          <Input
            label="Salary/Stipend"
            name="salaryStipend"
            value={form.salaryStipend}
            onChange={handleChange}
            required
          />
          <Input
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
          />
          <Input
            label="Required Skills (comma separated)"
            name="requiredSkills"
            value={form.requiredSkills}
            onChange={handleChange}
            required
          />
          <div className="flex gap-2 mt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              Update Job
            </Button>
            <Link to="/recruiter-dashboard" className="flex-1">
              <Button
                type="button"
                className="w-full bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditJobPage;
