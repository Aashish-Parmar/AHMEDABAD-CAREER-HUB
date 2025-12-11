import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Card from "../components/common/Card";
import Pagination from "../components/common/Pagination";

// --- Custom CSS for Animations & Gradient ---
// (You can move this to your global CSS if desired)
const styles = `
@keyframes typingFadeIn {from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:translateY(0);} }
.cp-fade-in { animation: typingFadeIn 1.1s both; }
@keyframes cardPop { 0%{transform:scale(1.05) translateY(15px); opacity:0.5} 80%{transform:scale(1.01);} 100%{transform:scale(1) translateY(0);opacity:1;} }
.cp-card-anim { animation: cardPop 0.68s cubic-bezier(.45,.75,.38,1.1) both;}
.bg-animated-companies {
  background: linear-gradient(135deg,#f0f9ff 0%,#bae6fd 22%,#e0e7ff 55%,#f1f5f9 100%);
  min-height: 100vh;
  position: relative;
}
.companies-blur1 {position:absolute;top:-60px;left:-90px;width:300px;height:180px;border-radius:45%;background:radial-gradient(ellipse at center,#38bdf8cc,#3b82f652 70%,transparent 100%);filter:blur(60px);}
.companies-blur2 {position:absolute;right:-70px;bottom:-50px;width:220px;height:160px;border-radius:35%;background:radial-gradient(ellipse at center,#818cf8bb,#bae6fd55 60%,transparent 100%);filter:blur(48px);}
.companies-blur1, .companies-blur2 {
  pointer-events: none;
  will-change: filter, transform;
  contain: layout paint;
  /* Optionally reduce width/height or blur for better performance */
}
@media (max-width: 640px) {
  .companies-blur1, .companies-blur2 {
    display: none;
  }
}
`;

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const params = [`page=${currentPage}`, `limit=12`];
        if (search) params.push(`search=${encodeURIComponent(search)}`);
        const url = `/companies?${params.join("&")}`;
        const res = await api.get(url);
        
        if (res.data.pagination) {
          setCompanies(res.data.companies || []);
          setPagination(res.data.pagination);
        } else {
          // Fallback for old format
          const allCompanies = Array.isArray(res.data) ? res.data : (res.data.companies || []);
          setCompanies(allCompanies);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalItems: allCompanies.length,
            itemsPerPage: allCompanies.length
          });
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
        toast.error("Failed to load companies");
        setCompanies([]);
      }
      setLoading(false);
    };
    fetchCompanies();
  }, [search, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  return (
    <div className="relative bg-animated-companies py-8 px-1 min-h-[100vh] overflow-x-hidden">
      <style>{styles}</style>
      <div className="companies-blur1" />
      <div className="companies-blur2" />
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-8 relative z-10">
        <h1
          className="text-3xl font-black text-blue-700 mb-3 tracking-tight cp-fade-in text-center lg:text-left"
          style={{ animationDelay: "120ms" }}
        >
          Ahmedabad’s Companies
        </h1>
        <p
          className="text-gray-600 mb-7 cp-fade-in text-center lg:text-left"
          style={{ animationDelay: "220ms" }}
        >
          Discover startups, IT firms, and industry giants hiring in Ahmedabad.{' '}
          <span className="text-blue-500">
            Browse, search, and click for in-depth tech stacks and open roles.
          </span>
        </p>
        <div className="mb-7 cp-fade-in flex justify-center lg:justify-start" style={{ animationDelay: "400ms" }}>
          <div className="w-full max-w-lg">
            <input
              type="text"
              placeholder="🔎 Search company by name..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="border border-cyan-200 px-4 py-2 rounded-full w-full text-lg bg-white shadow-sm outline-2 outline-blue-200 transition-all duration-200 focus:ring focus:ring-blue-100"
            />
            {search && (
              <button
                onClick={() => handleSearchChange("")}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
        {loading ? (
          <div className="text-center p-8">
            <div className="animate-spin inline-block h-10 w-10 border-4 border-blue-300 border-t-transparent border-solid rounded-full" />
            <div className="text-blue-500 font-medium mt-3">
              Loading Companies...
            </div>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center text-gray-500 p-8 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-lg font-medium mb-2">No companies found</div>
            <div className="text-sm">Try adjusting your search</div>
          </div>
        ) : (
          <>
            {pagination && (
              <div className="mb-4 text-sm text-gray-600">
                Found {pagination.totalItems} compan{pagination.totalItems !== 1 ? 'ies' : 'y'}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 w-full">
              {companies.map((company, i) => (
                <Link
                  key={company._id}
                  to={`/companies/${company._id}`}
                  tabIndex={0}
                  className="focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  <Card
                    className={`group hover:shadow-blue-200/60 hover:border-blue-400 hover:-translate-y-1 border-2 border-transparent transition h-full cp-card-anim`}
                    style={{ animationDelay: `${50 + (i % 6) * 50}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={company.logoUrl || "/vite.svg"}
                        alt="logo"
                        className="h-12 w-12 rounded-md bg-gray-100 object-contain border border-cyan-100 shadow-sm transition group-hover:scale-105"
                      />
                      <h2 className="text-lg font-semibold text-blue-900 group-hover:underline">
                        {company.companyName}
                      </h2>
                    </div>
                    <div className="text-gray-700 text-sm mb-1 truncate">
                      <span className="inline-flex items-center font-medium text-cyan-600 mr-1">
                        📍
                      </span>
                      {company.address}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      <span className="font-semibold text-blue-700">
                        Tech Stack:
                      </span>{' '}
                      <span className="text-gray-800">
                        {(company.techStack || []).join(", ") || (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            
            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;
