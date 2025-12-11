import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

// Animated glass morph styles (add to global CSS or inline <style>)
const styles = `
@keyframes fadeInUp {0%{opacity:0;transform:translateY(28px);}100%{opacity:1;transform:translateY(0);}}
.cdp-bg {
  background: linear-gradient(112deg,#e0e7ff 0%,#bae6fd 38%,#f1f5f9 100%);
  min-height: 100vh;
  position:relative;
}
.cdpBlur1 {
  position:absolute; top:-60px; left:-70px; width:220px; height:150px;
  border-radius:38%; background:radial-gradient(ellipse,#3b82f6AA,#bae6fd55 64%,transparent 100%); filter:blur(40px);
}
.cdpBlur2 {
  position:absolute; bottom:0; right:-60px; width:150px; height:180px;
  border-radius:45%; background:radial-gradient(ellipse,#818cf885,#f0f9ff45 70%,transparent 100%); filter:blur(34px);
}
.fadeInCd { animation:fadeInUp .9s cubic-bezier(.45,1.12,.32,.98) both;}
`;

const CompanyDetailPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [interviewsLoading, setInterviewsLoading] = useState(true);
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get(`/companies/${id}`);
        setCompany(res.data);
      } catch {
        setCompany(null);
      }
      setLoading(false);
    };
    const fetchJobs = async () => {
      try {
        const res = await api.get(`/jobs?company=${id}`);
        // Handle both old format (array) and new format (object with jobs and pagination)
        const jobsData = Array.isArray(res.data) ? res.data : (res.data.jobs || []);
        setJobs(jobsData);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobs([]);
      }
      setJobsLoading(false);
    };
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          // Updated route: /interviews/company/:companyId
          const res = await api.get(`/interviews/company/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // Handle both array and object format
          setInterviews(Array.isArray(res.data) ? res.data : (res.data.interviews || []));
        } else {
          setInterviews([]);
        }
      } catch (err) {
        console.error("Error fetching interviews:", err);
        setInterviews([]);
      }
      setInterviewsLoading(false);
    };
    fetchCompany();
    fetchJobs();
    fetchInterviews();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[40vh]">
        <span className="animate-spin h-9 w-9 border-4 border-blue-300 border-t-transparent border-solid rounded-full" />
        <span className="ml-3 text-blue-700 font-bold">Loading company details...</span>
      </div>
    );
  if (!company)
    return (
      <div className="text-center mt-14 text-xl font-semibold text-red-600">Company not found.</div>
    );

  return (
    <div className="cdp-bg min-h-screen relative pb-16">
      <style>{styles}</style>
      <div className="cdpBlur1" />
      <div className="cdpBlur2" />
      <div className="relative z-10 max-w-3xl mx-auto px-1 sm:px-4 pt-6 fadeInCd">
        {/* Profile Card */}
        <Card className="mb-8 bg-white/80 shadow-lg border-2 border-blue-100 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-1">
            <img
              src={company.logoUrl || "/vite.svg"}
              alt="logo"
              className="h-16 w-16 rounded-xl bg-gray-100 object-contain border border-cyan-100 shadow"
            />
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-800">
                {company.companyName}
              </h1>
              <div className="text-gray-700 text-sm mt-1">
                <span className="text-cyan-500">📍</span>
                {company.address}
              </div>
            </div>
          </div>
          <hr className="my-4 opacity-30" />
          <div className="mb-2">
            <span className="font-semibold text-blue-800">About: </span>
            <span className="text-gray-800">{company.description}</span>
          </div>
          {company.website && (
            <div className="mb-2">
              <span className="font-semibold text-blue-800">Website: </span>
              <a
                href={company.website}
                className="text-cyan-700 underline hover:text-blue-700 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                {company.website}
              </a>
            </div>
          )}
          {company.techStack?.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold text-blue-800">Tech Stack:</span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                {company.techStack.map((tech) => (
                  <span key={tech} className="bg-blue-100 text-cyan-900 px-2 py-0.5 rounded-full text-xs font-semibold shadow">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
          {isLoggedIn && user?.role === "student" && (
            <div className="mt-6">
              <Button
                className="bg-cyan-600 text-white shadow font-semibold px-6 py-2 rounded-xl hover:scale-105 transition"
                onClick={() => navigate(`/submit-interview?companyId=${company._id}`)}
              >
                ✍️ Share Your Interview Experience
              </Button>
            </div>
          )}
        </Card>

        {/* Open Jobs */}
        <section className="mb-10">
          <h2 className="text-lg sm:text-xl font-bold text-blue-700 mb-3">Open Jobs & Internships</h2>
          {jobsLoading ? (
            <div className="text-blue-500">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="text-gray-500 font-medium">No active jobs found for this company.</div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job._id} className="border-l-4 border-cyan-400 bg-white/90 shadow group hover:bg-blue-50/60 hover:border-blue-400 transition">
                  <div className="font-bold text-blue-700 group-hover:underline">{job.title} <span className="font-normal text-gray-600">({job.jobType})</span></div>
                  <div className="text-sm text-gray-700 mt-1">{job.description}</div>
                  <div className="text-xs text-gray-600 mt-2">
                    <span className="font-medium text-blue-700">Skills:</span> {(job.requiredSkills || []).join(", ")}{" | "}
                    <span className="font-medium text-blue-700">Salary/Stipend:</span> {job.salaryStipend}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Interview Experiences */}
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-green-700 mb-2">Interview Experiences</h2>
          {interviewsLoading ? (
            <div className="text-cyan-500">Loading interviews...</div>
          ) : interviews.length === 0 ? (
            <div className="text-gray-500 font-medium">No interview experiences shared yet.</div>
          ) : (
            <div className="space-y-4">
              {interviews.map((exp) => (
                <Card key={exp._id} className="border-l-4 border-green-400 bg-white/90 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-green-700">Overall Rating: {exp.overallRating} / 5</span>
                    <span className="text-xs text-gray-500">
                      {exp.isAnonymous
                        ? "Anonymous Student"
                        : exp.user?.college || "Student"}
                      {" | Interviewed on: "}
                      {new Date(exp.interviewDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2 space-y-2">
                    {exp.rounds.map((round, idx) => (
                      <div key={idx} className="pl-1">
                        <span className="font-bold">{round.roundType}</span>
                        <div className="ml-2 text-sm">
                          <span className="font-semibold text-gray-700">Questions:</span>{" "}
                          {round.questionsAsked?.join("; ") || <span className="text-gray-400">N/A</span>}
                        </div>
                        <div className="ml-2 text-xs text-gray-500">
                          Difficulty: {round.difficultyRating}/5
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
