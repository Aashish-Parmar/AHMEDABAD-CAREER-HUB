import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const MyCompanyPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [company, setCompany] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [form, setForm] = useState({
    companyName: "",
    description: "",
    website: "",
    logoUrl: "",
    address: "",
    techStack: "",
  });

  useEffect(() => {
    if (user?.role !== "recruiter") {
      toast.error("Only recruiters can access this page");
      navigate("/dashboard");
      return;
    }

    fetchCompany();
  }, [token, user]);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      // Axios interceptor handles Authorization header automatically
      const res = await api.get("/companies/my");
      setCompany(res.data.company);
      setStatistics(res.data.statistics);
      setForm({
        companyName: res.data.company.companyName || "",
        description: res.data.company.description || "",
        website: res.data.company.website || "",
        logoUrl: res.data.company.logoUrl || "",
        address: res.data.company.address || "",
        techStack: (res.data.company.techStack || []).join(", "),
      });
    } catch (err) {
      if (err.response?.status === 404) {
        // No company linked, redirect to create
        navigate("/create-company");
      } else if (err.response?.status === 401) {
        // Authentication error
        toast.error("Please login again");
        // Optionally logout and redirect to login
      } else {
        console.error("Error fetching company:", err);
        toast.error("Failed to load company details");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form to original values
    if (company) {
      setForm({
        companyName: company.companyName || "",
        description: company.description || "",
        website: company.website || "",
        logoUrl: company.logoUrl || "",
        address: company.address || "",
        techStack: (company.techStack || []).join(", "),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating company...");

    try {
      const payload = {
        companyName: form.companyName.trim(),
        description: form.description.trim(),
        website: form.website.trim() || undefined,
        logoUrl: form.logoUrl.trim() || undefined,
        address: form.address.trim(),
        techStack: form.techStack
          ? form.techStack
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };

      const res = await api.patch(`/companies/${company._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCompany(res.data.company);
      setEditing(false);
      toast.success("Company updated successfully!", { id: loadingToast });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to update company. Please try again.";
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your company? This action cannot be undone and you'll need to create a new company profile."
      )
    ) {
      return;
    }

    const loadingToast = toast.loading("Deleting company...");
    try {
      await api.delete(`/companies/${company._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Company deleted successfully", { id: loadingToast });
      navigate("/create-company");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to delete company. Please try again.";
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <Card>
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading company details...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Company</h2>
          <Link to="/recruiter-dashboard">
            <Button className="bg-gray-500 hover:bg-gray-600">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Jobs Posted</div>
              <div className="text-2xl font-bold text-blue-600">
                {statistics.jobsPosted}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Applications Received</div>
              <div className="text-2xl font-bold text-green-600">
                {statistics.applicationsReceived}
              </div>
            </div>
          </div>
        )}

        {!editing ? (
          <div>
            {/* View Mode */}
            <div className="space-y-4">
              {company.logoUrl && (
                <div className="flex justify-center mb-4">
                  <img
                    src={company.logoUrl}
                    alt={company.companyName}
                    className="h-32 w-32 object-contain rounded-lg border"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <div className="text-lg font-semibold text-gray-900">
                  {company.companyName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {company.description}
                </div>
              </div>

              {company.website && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {company.website}
                  </a>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="text-gray-700">{company.address}</div>
              </div>

              {company.techStack && company.techStack.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tech Stack
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {company.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleEdit}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Edit Company
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete Company
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Edit Mode */}
            <div className="space-y-4">
              <Input
                label="Company Name"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                required
              />

              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  minLength={10}
                />
              </div>

              <Input
                label="Website"
                name="website"
                type="url"
                value={form.website}
                onChange={handleChange}
                placeholder="https://www.example.com"
              />

              <Input
                label="Logo URL"
                name="logoUrl"
                type="url"
                value={form.logoUrl}
                onChange={handleChange}
                placeholder="https://www.example.com/logo.png"
              />

              <Input
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                minLength={5}
              />

              <Input
                label="Tech Stack (comma separated)"
                name="techStack"
                value={form.techStack}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div className="flex gap-2 mt-6">
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                Save Changes
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default MyCompanyPage;
