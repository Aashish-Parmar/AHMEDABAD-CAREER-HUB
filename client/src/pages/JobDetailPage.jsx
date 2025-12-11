// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import api from "../api/axios";
// import Card from "../components/common/Card";
// import { useAuth } from "../context/AuthContext";
// import Button from "../components/common/Button";

// const JobDetailPage = () => {
//   const { id } = useParams();
//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [applied, setApplied] = useState(false);
//   const [error, setError] = useState("");
//   const { user, token, isLoggedIn } = useAuth();

//   useEffect(() => {
//     const fetchJob = async () => {
//       setLoading(true);
//       try {
//         const res = await api.get(`/jobs/${id}`);
//         setJob(res.data);
//       } catch {
//         setJob(null);
//       }
//       setLoading(false);
//     };
//     fetchJob();
//   }, [id]);

//   const handleApply = async () => {
//     setError("");
//     try {
//       await api.post(
//         "/applications",
//         { job: job._id },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setApplied(true);
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to apply. Try again or check credentials."
//       );
//     }
//   };

//   if (loading)
//     return (
//       <div className="text-center mt-8 animate-pulse">
//         Loading job details...
//       </div>
//     );
//   if (!job)
//     return <div className="text-center mt-8 text-red-600">Job not found.</div>;

//   return (
//     <div className="max-w-2xl mx-auto px-4 mt-8 fade-in-up">
//       <Card className="glow-border p-6 shadow-lg rounded-xl bg-white">
//         <h1 className="text-3xl font-bold mb-4 text-blue-700">{job.title}</h1>
//         <div className="mb-2 text-gray-700">
//           <strong>{job.jobType}</strong> @{" "}
//           <span className="font-semibold">{job.company?.companyName}</span>
//         </div>
//         <div className="mb-2 text-gray-600">📍 {job.location}</div>
//         <div className="mb-4 text-gray-800">{job.description}</div>
//         <div className="mb-2 text-gray-700">
//           <span className="font-semibold">Key Skills:</span>{" "}
//           {(job.requiredSkills || []).join(", ")}
//         </div>
//         <div className="mb-4 text-gray-700">
//           <span className="font-semibold">Salary/Stipend:</span>{" "}
//           {job.salaryStipend}
//         </div>
//         <div className="mb-6">
//           <span className="font-semibold">About Company: </span>
//           <Link
//             to={`/companies/${job.company?._id}`}
//             className="text-blue-600 hover:underline"
//           >
//             {job.company?.companyName}
//           </Link>
//         </div>

//         {isLoggedIn &&
//           user?.role === "student" &&
//           (applied ? (
//             <div className="text-green-700 font-medium">
//               ✅ You have applied to this job.
//             </div>
//           ) : (
//             <Button type="button" className="mt-4 w-full" onClick={handleApply}>
//               Apply Now
//             </Button>
//           ))}
//         {error && <div className="text-red-600 mt-2">{error}</div>}
//       </Card>
//     </div>
//   );
// };

// export default JobDetailPage;


import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Card from "../components/common/Card";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingApplication, setCheckingApplication] = useState(false);

  const [applied, setApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [error, setError] = useState("");
  const { user, token, isLoggedIn } = useAuth();

  // Check if user has already applied to this job
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!isLoggedIn || user?.role !== "student" || !token) {
        return;
      }
      
      setCheckingApplication(true);
      try {
        const res = await api.get("/applications/mine", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const apps = Array.isArray(res.data) ? res.data : (res.data.applications || []);
        const existingApp = apps.find(app => app.job?._id === id);
        if (existingApp) {
          setApplied(true);
          setApplicationStatus(existingApp.status);
        }
      } catch (err) {
        console.error("Error checking application status:", err);
      } finally {
        setCheckingApplication(false);
      }
    };

    checkApplicationStatus();
  }, [id, isLoggedIn, user, token]);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job:", err);
        toast.error("Failed to load job details");
        setJob(null);
      }
      setLoading(false);
    };
    fetchJob();

    // AdSense Ad Loading Logic for SPAs
    // This will run whenever the 'id' (job ID) changes,
    // ensuring a new ad is requested for the new job detail page.
    try {
      // Check if adsbygoogle array exists on window, if not, initialize it.
      // Then push an empty object to trigger ad loading in the <ins> tag.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense script not loaded or error:", e);
      // You might want to add a fallback UI or log this error
    }
  }, [id]); // Dependency array: re-run this effect when the job ID changes

  const handleApply = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }

    if (user?.role !== "student") {
      toast.error("Only students can apply to jobs");
      return;
    }

    setError("");
    const loadingToast = toast.loading("Applying to job...");
    
    try {
      await api.post(
        "/applications",
        { job: job._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplied(true);
      setApplicationStatus("applied");
      toast.success("Successfully applied to job!", { id: loadingToast });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to apply. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  if (loading)
    return <div className="text-center mt-8 animate-pulse">Loading job details...</div>;
  if (!job)
    return <div className="text-center mt-8 text-red-600">Job not found.</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 mt-8 fade-in-up">
      <Card className="glow-border p-6 shadow-lg rounded-xl bg-white">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">{job.title}</h1>
        <div className="mb-2 text-gray-700">
          <strong>{job.jobType}</strong> @{" "}
          <span className="font-semibold">{job.company?.companyName}</span>
        </div>
        <div className="mb-2 text-gray-600">📍 {job.location}</div>
        <div className="mb-4 text-gray-800">{job.description}</div>
        

        <div className="mb-2 text-gray-700">
          <span className="font-semibold">Key Skills:</span>{" "}
          {(job.requiredSkills || []).join(", ")}
        </div>
        <div className="mb-4 text-gray-700">
          <span className="font-semibold">Salary/Stipend:</span>{" "}
          {job.salaryStipend}
        </div>
        <div className="mb-6">
          <span className="font-semibold">About Company: </span>
          <Link
            to={`/companies/${job.company?._id}`}
            className="text-blue-600 hover:underline"
          >
            {job.company?.companyName}
          </Link>
        </div>

        {isLoggedIn && user?.role === "student" && (
          checkingApplication ? (
            <div className="text-gray-500 mt-4">Checking application status...</div>
          ) : applied ? (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-700 font-medium">✅ You have applied to this job.</div>
              {applicationStatus && (
                <div className="text-sm text-green-600 mt-1">
                  Status: <span className="font-semibold capitalize">{applicationStatus}</span>
                </div>
              )}
              <Link to="/applications" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
                View all applications →
              </Link>
            </div>
          ) : (
            <Button type="button" className="mt-4 w-full bg-blue-600 hover:bg-blue-700" onClick={handleApply}>
              Apply Now
            </Button>
          )
        )}
        {!isLoggedIn && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm mb-2">Please login to apply for this job</p>
            <Button 
              type="button" 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={() => navigate("/login")}
            >
              Login to Apply
            </Button>
          </div>
        )}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </Card>
    </div>
  );
};

export default JobDetailPage;