import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const CreateCompanyPage = () => {
  const { user, token, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
      toast.error("Only recruiters can create companies");
      navigate("/dashboard");
      return;
    }

    // Pre-fill company name from registration
    if (user?.companyName) {
      setForm((prev) => ({ ...prev, companyName: user.companyName }));
    }

    // Check if user already has a company
    if (user?.company) {
      toast.error("You already have a company linked to your account");
      navigate("/my-company");
      return;
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Creating company profile...");

    try {
      const payload = {
        companyName: form.companyName.trim(),
        description: form.description.trim(),
        website: form.website.trim() || undefined,
        logoUrl: form.logoUrl.trim() || undefined,
        address: form.address.trim(),
        techStack: form.techStack
          ? form.techStack.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      const res = await api.post("/companies", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Company profile created successfully!", { id: loadingToast });
      
      // Refresh user data to get updated company link
      try {
        const profileRes = await api.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Update user context
        login({
          user: {
            _id: profileRes.data._id,
            name: profileRes.data.name,
            email: profileRes.data.email,
            role: profileRes.data.role,
            college: profileRes.data.college,
            company: profileRes.data.company,
            companyName: profileRes.data.companyName,
            avatarUrl: profileRes.data.avatarUrl,
          },
          token,
        });
      } catch (err) {
        console.error("Error refreshing user data:", err);
      }
      
      setTimeout(() => {
        navigate("/recruiter-dashboard");
      }, 1500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to create company. Please try again.";
      toast.error(errorMsg, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "recruiter") {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <Card>
        <h2 className="text-2xl font-bold mb-4">Create Your Company Profile</h2>
        <p className="text-gray-600 mb-6">
          Complete your company profile to start posting jobs and attracting talent.
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Company Name"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            required
            placeholder="Enter your company name"
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
              placeholder="Describe your company, its mission, and what makes it unique..."
              minLength={10}
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 10 characters required
            </p>
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
            placeholder="Ahmedabad, Gujarat, India"
            minLength={5}
          />

          <Input
            label="Tech Stack (comma separated)"
            name="techStack"
            value={form.techStack}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB, Express"
          />

          <div className="flex gap-2 mt-6">
            <Button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Company Profile"}
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/recruiter-dashboard")}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateCompanyPage;

