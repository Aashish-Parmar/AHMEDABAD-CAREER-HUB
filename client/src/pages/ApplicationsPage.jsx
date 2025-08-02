import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Card from "../components/common/Card";

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
.fade-in-up { animation: fadeInUp 0.6s ease-out both; }
.card-hover:hover { transform: translateY(-4px) scale(1.01); transition: all 0.3s ease-in-out; }
.glow-border { animation: glowingBorder 3s ease-in-out infinite; }
`;

const ApplicationsPage = () => {
  const { token } = useAuth();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api
      .get("/applications/mine", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setApps(res.data))
      .catch(() => setApps([]));
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4">
      <style>{styles}</style>

      <div className="max-w-3xl mx-auto fade-in-up">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
          📂 My Job Applications
        </h2>

        {apps.length === 0 ? (
          <div className="text-center text-gray-500 mt-8 text-lg">
            No applications yet. Start exploring jobs!
          </div>
        ) : (
          <div className="space-y-5">
            {apps.map((app) => (
              <Card
                key={app._id}
                className="p-5 rounded-xl border-2 border-blue-100 bg-white shadow-md card-hover glow-border"
              >
                <div className="flex flex-col gap-1">
                  <div className="text-xl font-semibold text-blue-700">
                    {app.job?.title}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    🏢 {app.job?.company?.companyName}
                  </div>
                  <div className="text-gray-700 text-sm">
                    {app.job?.description?.slice(0, 100)}...
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>
                      📅 Applied:{" "}
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                    <span className="text-blue-600 font-semibold">
                      Status: {app.status || "Applied"}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
