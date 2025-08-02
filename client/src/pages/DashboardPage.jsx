// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import Card from "../components/common/Card";
// import Button from "../components/common/Button";
// import api from "../api/axios";
// import { Link, useNavigate } from "react-router-dom";

// const DashboardPage = () => {
//   const { user, token, logout } = useAuth();
//   const [apps, setApps] = useState([]); // For students
//   const [jobs, setJobs] = useState([]); // For recruiters
//   const [loading, setLoading] = useState(true);
//   const [alert, setAlert] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     setAlert("");
//     setLoading(true);
//     if (user?.role === "student") {
//       api
//         .get("/applications/mine", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => setApps(res.data))
//         .catch(() => setApps([]))
//         .finally(() => setLoading(false));
//     } else if (user?.role === "recruiter") {
//       api
//         .get("/jobs", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           setJobs(res.data.filter((job) => job.company?._id === user.company));
//         })
//         .catch(() => setJobs([]))
//         .finally(() => setLoading(false));
//     }
//   }, [user, token]);

//   return (
//     <div className="max-w-3xl mx-auto mt-10 px-2">
//       <Card>
//         <h2 className="text-2xl font-bold mb-2">
//           Welcome, {user?.name || user?.email}!
//         </h2>
//         <div className="mb-4 text-gray-700">
//           <span className="font-medium">Role:</span>{" "}
//           {user?.role === "recruiter" ? "Recruiter" : "Student"}
//         </div>
//         {/* Student Dashboard */}
//         {user?.role === "student" && (
//           <>
//             <div className="mb-4">
//               <h3 className="text-lg font-semibold mb-2">
//                 Recent Job Applications
//               </h3>
//               {loading ? (
//                 <div>Loading applications...</div>
//               ) : apps.length === 0 ? (
//                 <div className="text-gray-500">No applications yet.</div>
//               ) : (
//                 <div className="space-y-2">
//                   {apps.slice(0, 3).map((app) => (
//                     <Card key={app._id} className="mb-1 border-blue-100">
//                       <div className="font-semibold">{app.job?.title}</div>
//                       <div className="text-xs text-gray-500">
//                         {app.job?.company?.companyName}
//                       </div>
//                       <div className="text-xs">
//                         Status: {app.status || "applied"}
//                       </div>
//                       <div className="text-xs text-gray-400">
//                         Applied on:{" "}
//                         {new Date(app.appliedAt).toLocaleDateString()}
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//               <div className="mt-3 flex gap-2 flex-wrap">
//                 <Link to="/applications">
//                   <Button className="bg-blue-500 hover:bg-blue-600">
//                     View All Applications
//                   </Button>
//                 </Link>
//                 <Link to="/submit-interview">
//                   <Button className="bg-green-500 hover:bg-green-600">
//                     Submit Interview Experience
//                   </Button>
//                 </Link>
//                 <Link to="/jobs">
//                   <Button className="bg-cyan-500 hover:bg-cyan-600">
//                     Browse Jobs
//                   </Button>
//                 </Link>
//                 <Link to="/companies">
//                   <Button className="bg-pink-500 hover:bg-pink-600">
//                     Browse Companies
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </>
//         )}
//         {/* Recruiter Dashboard */}
//         {user?.role === "recruiter" && (
//           <>
//             <div className="mb-4">
//               <h3 className="text-lg font-semibold mb-2">Your Job Postings</h3>
//               {loading ? (
//                 <div>Loading jobs...</div>
//               ) : jobs.length === 0 ? (
//                 <div className="text-gray-500">No jobs posted yet.</div>
//               ) : (
//                 <div className="space-y-2">
//                   {jobs.slice(0, 3).map((job) => (
//                     <Card key={job._id} className="mb-1 border-blue-100">
//                       <div className="font-bold">{job.title}</div>
//                       <div className="text-xs text-gray-500">
//                         {job.jobType} | {job.location || "Ahmedabad"}
//                       </div>
//                       <div className="text-xs">
//                         Salary/Stipend: {job.salaryStipend}
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//               <div className="mt-3 flex gap-2 flex-wrap">
//                 <Link to="/post-job">
//                   <Button className="bg-blue-500 hover:bg-blue-600">
//                     Post New Job
//                   </Button>
//                 </Link>
//                 <Link to="/jobs">
//                   <Button className="bg-cyan-500 hover:bg-cyan-600">
//                     View All Jobs
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </>
//         )}
//         {alert && <div className="text-green-600 mt-2">{alert}</div>}
//         {/* <div className="text-right mt-6">
//           <Button
//             type="button"
//             className="bg-red-500 hover:bg-red-600"
//             onClick={logout}
//           >
//             Log out
//           </Button>
//         </div> */}
//       </Card>
//     </div>
//   );
// };

// export default DashboardPage;

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

// Custom animation styles injected
const styles = `
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes glowingBorder {
  0% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
  100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); }
}
.fade-in-up { animation: fadeInUp 0.8s ease-out both; }
.card-hover:hover { transform: translateY(-4px) scale(1.01); transition: all 0.3s ease-in-out; }
.glow-border { animation: glowingBorder 3s ease-in-out infinite; }
`;

const DashboardPage = () => {
  const { user, token, logout } = useAuth();
  const [apps, setApps] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setAlert("");
    setLoading(true);
    if (user?.role === "student") {
      api
        .get("/applications/mine", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setApps(res.data))
        .catch(() => setApps([]))
        .finally(() => setLoading(false));
    } else if (user?.role === "recruiter") {
      api
        .get("/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setJobs(res.data.filter((job) => job.company?._id === user.company));
        })
        .catch(() => setJobs([]))
        .finally(() => setLoading(false));
    }
  }, [user, token]);

  return (
    <>
      <style>{styles}</style>
      <div className="max-w-4xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 fade-in-up">
        <Card className="p-6 shadow-lg rounded-xl bg-white glow-border">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Welcome, {user?.name || user?.email}!
          </h2>
          <div className="mb-6 text-gray-600 text-lg">
            <span className="font-semibold">Role:</span>{" "}
            {user?.role === "recruiter" ? "Recruiter" : "Student"}
          </div>

          {/* Student Dashboard */}
          {user?.role === "student" && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">
                Recent Job Applications
              </h3>
              {loading ? (
                <div className="text-gray-500">Loading applications...</div>
              ) : apps.length === 0 ? (
                <div className="text-gray-400">No applications yet.</div>
              ) : (
                <div className="space-y-4">
                  {apps.slice(0, 3).map((app) => (
                    <Card
                      key={app._id}
                      className="p-4 border border-blue-100 rounded-lg card-hover glow-border"
                    >
                      <div className="font-semibold text-lg text-gray-800">
                        {app.job?.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {app.job?.company?.companyName}
                      </div>
                      <div className="text-sm">
                        Status: {app.status || "applied"}
                      </div>
                      <div className="text-xs text-gray-400">
                        Applied on:{" "}
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              <div className="mt-5 flex gap-3 flex-wrap">
                <Link to="/applications">
                  <Button className="bg-blue-500 hover:bg-blue-600 transition-all duration-200">
                    View All Applications
                  </Button>
                </Link>
                <Link to="/submit-interview">
                  <Button className="bg-green-500 hover:bg-green-600 transition-all duration-200">
                    Submit Interview Experience
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button className="bg-cyan-500 hover:bg-cyan-600 transition-all duration-200">
                    Browse Jobs
                  </Button>
                </Link>
                <Link to="/companies">
                  <Button className="bg-pink-500 hover:bg-pink-600 transition-all duration-200">
                    Browse Companies
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Recruiter Dashboard */}
          {user?.role === "recruiter" && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">
                Your Job Postings
              </h3>
              {loading ? (
                <div className="text-gray-500">Loading jobs...</div>
              ) : jobs.length === 0 ? (
                <div className="text-gray-400">No jobs posted yet.</div>
              ) : (
                <div className="space-y-4">
                  {jobs.slice(0, 3).map((job) => (
                    <Card
                      key={job._id}
                      className="p-4 border border-blue-100 rounded-lg card-hover glow-border"
                    >
                      <div className="font-bold text-gray-800 text-lg">
                        {job.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {job.jobType} | {job.location || "Ahmedabad"}
                      </div>
                      <div className="text-sm">
                        Salary/Stipend: {job.salaryStipend}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              <div className="mt-5 flex gap-3 flex-wrap">
                <Link to="/post-job">
                  <Button className="bg-blue-500 hover:bg-blue-600 transition-all duration-200">
                    Post New Job
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button className="bg-cyan-500 hover:bg-cyan-600 transition-all duration-200">
                    View All Jobs
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {alert && (
            <div className="text-green-600 mt-4 text-center font-medium">
              {alert}
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default DashboardPage;
