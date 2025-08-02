import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const PostJobPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    jobType: "internship",
    salaryStipend: "",
    location: "Ahmedabad",
    requiredSkills: "",
  });
  const [alert, setAlert] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setAlert("");
  //   try {
  //     const payload = {
  //       ...form,
  //       requiredSkills: form.requiredSkills.split(",").map(s => s.trim()).filter(Boolean),
  //       company: user.company, // The recruiter's linked ObjectId
  //     };
  //     await api.post("/jobs", payload, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setAlert("Job posted successfully!");
  //     setTimeout(() => navigate("/recruiter-dashboard"), 1200);
  //   } catch (err) {
  //     setError(
  //       err.response?.data?.message ||
  //       "Job posting failed. Check your info and try again."
  //     );
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setAlert("");
  try {
    const payload = {
      ...form,
      requiredSkills: form.requiredSkills.split(",").map(s => s.trim()).filter(Boolean),
      company: user.company, // The recruiter's linked ObjectId
    };
    // Add this log:
    console.log(payload);
    await api.post("/jobs", payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAlert("Job posted successfully!");
    setTimeout(() => navigate("/recruiter-dashboard"), 1200);
  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Job posting failed. Check your info and try again."
    );
  }
};


  if (user?.role !== "recruiter") {
    return <Card className="mt-10 text-center text-red-600">Only recruiters can post jobs.</Card>
  }

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <h2 className="text-xl font-bold mb-4">Post a New Job</h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <Input
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <label className="block mb-1 font-medium text-gray-700">Type</label>
          <select
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full mb-3"
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
          {error && <div className="text-red-600 mb-2">{error}</div>}
          {alert && <div className="text-green-600 mb-2">{alert}</div>}
          <Button type="submit" className="w-full mt-2">Post Job</Button>
        </form>
      </Card>
    </div>
  );
};

export default PostJobPage;
