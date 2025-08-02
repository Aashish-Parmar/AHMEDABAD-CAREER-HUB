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
//     return <div className="text-center mt-8">Loading job details...</div>;
//   if (!job)
//     return <div className="text-center mt-8 text-red-600">Job not found.</div>;

//   return (
//     <div className="max-w-2xl mx-auto px-4 mt-8">
//       <Card>
//         <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
//         <div className="mb-2 text-gray-700">
//           {job.jobType} @ {job.company?.companyName}
//         </div>
//         <div className="mb-2 text-gray-600">Location: {job.location}</div>
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
//         {/* APPLY BUTTON FOR STUDENTS ONLY */}
//         {isLoggedIn &&
//           user?.role === "student" &&
//           (applied ? (
//             <div className="text-green-700 font-medium">
//               You have applied to this job.
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
import api from "../api/axios";
import Card from "../components/common/Card";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";

const JobDetailPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");
  const { user, token, isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch {
        setJob(null);
      }
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    setError("");
    try {
      await api.post(
        "/applications",
        { job: job._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplied(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to apply. Try again or check credentials."
      );
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
          applied ? (
            <div className="text-green-700 font-medium">✅ You have applied to this job.</div>
          ) : (
            <Button type="button" className="mt-4 w-full" onClick={handleApply}>
              Apply Now
            </Button>
          )
        )}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </Card>
    </div>
  );
};

export default JobDetailPage;
