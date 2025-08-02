// import React, { useEffect, useState } from "react";
// import api from "../api/axios";
// import Card from "../components/common/Card";
// import { Link, useNavigate } from "react-router-dom";


// const JobsPage = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     type: "",
//     title: "",
//     tech: ""
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchJobs = async () => {
//       setLoading(true);
//       try {
//         const params = [];
//         if (filters.type) params.push(`type=${encodeURIComponent(filters.type)}`);
//         if (filters.title) params.push(`title=${encodeURIComponent(filters.title)}`);
//         if (filters.tech) params.push(`tech=${encodeURIComponent(filters.tech)}`);
//         const url = `/jobs${params.length ? "?" + params.join("&") : ""}`;
//         const res = await api.get(url);
//         setJobs(res.data);
//       } catch {
//         setJobs([]);
//       }
//       setLoading(false);
//     };
//     fetchJobs();
//   }, [filters]);

//   return (
//     <div className="max-w-5xl mx-auto px-2 sm:px-4 mt-6 sm:mt-8">
//       <h1 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4 text-center sm:text-left">Open Jobs & Internships</h1>
//       <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-y-4 gap-x-3 items-stretch sm:items-end">
//         <div className="w-full sm:w-auto">
//           <label className="block mb-1 text-sm font-medium">Type</label>
//           <select
//             className="border px-3 py-2 rounded w-full min-w-[120px]"
//             value={filters.type}
//             onChange={(e) => setFilters({ ...filters, type: e.target.value })}
//           >
//             <option value="">All</option>
//             <option value="internship">Internship</option>
//             <option value="full-time">Full-Time</option>
//           </select>
//         </div>
//         <div className="w-full sm:w-auto">
//           <label className="block mb-1 text-sm font-medium">Title</label>
//           <input
//             type="text"
//             className="border px-3 py-2 rounded w-full min-w-[140px]"
//             placeholder="Role or keyword"
//             value={filters.title}
//             onChange={(e) => setFilters({ ...filters, title: e.target.value })}
//           />
//         </div>
//         <div className="w-full sm:w-auto">
//           <label className="block mb-1 text-sm font-medium">Tech Skill</label>
//           <input
//             type="text"
//             className="border px-3 py-2 rounded w-full min-w-[140px]"
//             placeholder="React, Node, etc."
//             value={filters.tech}
//             onChange={(e) => setFilters({ ...filters, tech: e.target.value })}
//           />
//         </div>
//       </div>
//       {loading ? (
//         <div className="text-center p-8">Loading jobs...</div>
//       ) : jobs.length === 0 ? (
//         <div className="text-center text-gray-500">No jobs found.</div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {jobs.map((job) => (
//             <Link to={`/jobs/${job._id}`} key={job._id}>
//               <Card key={job._id} className="hover:shadow-lg transition cursor-pointer h-full">
//                 <h2 className="text-lg font-bold mb-1">{job.title}</h2>
//                 <div className="text-xs text-gray-500 mb-1">{job.jobType} @ {job.location || 'Ahmedabad'}</div>
//                 <div className="text-sm text-gray-700">{job.description.slice(0, 100)}...</div>
//                 <div className="mt-2 text-xs">
//                   Company: <span className="font-medium">{job.company?.companyName}</span>
//                 </div>
//                 <div className="mt-1 text-xs">
//                   Skills: {(job.requiredSkills || []).join(", ")}
//                 </div>
//                 <div className="mt-1 text-xs">
//                   Stipend/Salary: {job.salaryStipend}
//                 </div>
//               </Card>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobsPage;


import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Card from "../components/common/Card";
import { Link, useNavigate } from "react-router-dom";

const styles = `
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.fade-in-up { animation: fadeInUp 0.5s ease-out both; }
.card-hover:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.25);
  transition: all 0.3s ease-in-out;
}
`;

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: "", title: "", tech: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = [];
        if (filters.type) params.push(`type=${encodeURIComponent(filters.type)}`);
        if (filters.title) params.push(`title=${encodeURIComponent(filters.title)}`);
        if (filters.tech) params.push(`tech=${encodeURIComponent(filters.tech)}`);
        const url = `/jobs${params.length ? "?" + params.join("&") : ""}`;
        const res = await api.get(url);
        setJobs(res.data);
      } catch {
        setJobs([]);
      }
      setLoading(false);
    };
    fetchJobs();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-blue-100 py-10 px-4">
      <style>{styles}</style>
      <div className="max-w-6xl mx-auto fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 text-center mb-8">
          🚀 Open Jobs & Internships
        </h1>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Type</label>
            <select
              className="border px-3 py-2 rounded w-full"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All</option>
              <option value="internship">Internship</option>
              <option value="full-time">Full-Time</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              className="border px-3 py-2 rounded w-full"
              placeholder="Role or keyword"
              value={filters.title}
              onChange={(e) => setFilters({ ...filters, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Tech Skill</label>
            <input
              type="text"
              className="border px-3 py-2 rounded w-full"
              placeholder="React, Node, etc."
              value={filters.tech}
              onChange={(e) => setFilters({ ...filters, tech: e.target.value })}
            />
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center text-gray-600 p-10">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500">No jobs found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Link to={`/jobs/${job._id}`} key={job._id} className="fade-in-up">
                <Card className="h-full card-hover border border-blue-100 bg-white p-5 rounded-xl">
                  <h2 className="text-lg font-bold text-blue-700 mb-1">{job.title}</h2>
                  <div className="text-xs text-gray-500 mb-1">
                    {job.jobType} @ {job.location || "Ahmedabad"}
                  </div>
                  <div className="text-sm text-gray-700">
                    {job.description?.slice(0, 100)}...
                  </div>
                  <div className="mt-2 text-xs">
                    🏢 Company: <span className="font-medium">{job.company?.companyName}</span>
                  </div>
                  <div className="mt-1 text-xs">
                    🛠️ Skills: {(job.requiredSkills || []).join(", ")}
                  </div>
                  <div className="mt-1 text-xs">
                    💰 Stipend/Salary: {job.salaryStipend}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
