

// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import api from "../api/axios";
// import Card from "../components/common/Card";
// import Input from "../components/common/Input";
// import Button from "../components/common/Button";

// const SubmitInterviewPage = () => {
//   const { token } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Get pre-selected company from query param
//   const params = new URLSearchParams(location.search);
//   const preSelectedCompany = params.get("companyId");

//   const [companies, setCompanies] = useState([]);
//   // Set initial company to preSelectedCompany if present
//   const [form, setForm] = useState({
//     company: preSelectedCompany || "",
//     interviewDate: "",
//     rounds: [{ roundType: "", questionsAsked: "", difficultyRating: 3 }],
//     overallRating: 3,
//     isAnonymous: true,
//   });
//   const [error, setError] = useState("");
//   const [alert, setAlert] = useState("");

//   // Fetch all companies for dropdown & for name lookup
//   useEffect(() => {
//     api.get("/companies").then((res) => setCompanies(res.data));
//   }, []);

//   // Lookup to show company name given id
//   const companyNameLookup = (id) => {
//     const company = companies.find((c) => c._id === id);
//     return company ? company.companyName : id;
//   };

//   // Handling dynamic rounds
//   const handleRoundChange = (idx, e) => {
//     const newRounds = form.rounds.map((r, i) =>
//       i === idx ? { ...r, [e.target.name]: e.target.value } : r
//     );
//     setForm((f) => ({ ...f, rounds: newRounds }));
//   };
//   const addRound = () =>
//     setForm((f) => ({
//       ...f,
//       rounds: [
//         ...f.rounds,
//         { roundType: "", questionsAsked: "", difficultyRating: 3 },
//       ],
//     }));
//   const removeRound = (idx) =>
//     setForm((f) => ({ ...f, rounds: f.rounds.filter((_, i) => i !== idx) }));

//   // General field change
//   const handleChange = (e) =>
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

//   // Form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setAlert("");
//     try {
//       const payload = {
//         ...form,
//         rounds: form.rounds.map((r) => ({
//           ...r,
//           questionsAsked: r.questionsAsked
//             .split(";")
//             .map((q) => q.trim())
//             .filter(Boolean),
//           difficultyRating: Number(r.difficultyRating),
//         })),
//         overallRating: Number(form.overallRating),
//         interviewDate: form.interviewDate || undefined,
//       };
//       await api.post("/interviews", payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAlert("Experience submitted successfully!");
//       setTimeout(() => navigate("/dashboard"), 1200);
//     } catch (err) {
//       setError(err.response?.data?.message || "Submission failed.");
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto mt-10">
//       <Card>
//         <h2 className="text-xl font-bold mb-4">
//           Share Your Interview Experience
//         </h2>
//         <form onSubmit={handleSubmit}>
//           {/* Company selection: Show dropdown only if not pre-selected */}
//           <label className="block mb-1">Company</label>
//           {!preSelectedCompany ? (
//             <select
//               name="company"
//               value={form.company}
//               onChange={handleChange}
//               required
//               className="border px-2 py-1 rounded w-full mb-3"
//             >
//               <option value="">-- Select Company --</option>
//               {companies.map((c) => (
//                 <option value={c._id} key={c._id}>
//                   {c.companyName}
//                 </option>
//               ))}
//             </select>
//           ) : (
//             <>
//               {/* Hidden input for form submit */}
//               <input type="hidden" name="company" value={form.company} />
//               <div className="mb-3 text-gray-700">
//                 Interviewing at:{" "}
//                 <span className="font-semibold">
//                   {companyNameLookup(preSelectedCompany)}
//                 </span>
//               </div>
//             </>
//           )}

//           <Input
//             label="Interview Date"
//             type="date"
//             name="interviewDate"
//             value={form.interviewDate}
//             onChange={handleChange}
//           />
//           <hr className="my-2" />
//           {form.rounds.map((rnd, idx) => (
//             <div key={idx} className="mb-3 border-b pb-2">
//               <div className="flex justify-between items-center text-sm font-medium mb-1">
//                 <span>Round {idx + 1}</span>
//                 {form.rounds.length > 1 && (
//                   <button
//                     onClick={() => removeRound(idx)}
//                     type="button"
//                     className="text-xs text-red-500"
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
//               <Input
//                 label="Type (Technical/HR/Managerial...)"
//                 name="roundType"
//                 value={rnd.roundType}
//                 onChange={(e) => handleRoundChange(idx, e)}
//                 required
//               />
//               <Input
//                 label="Questions (separate by semicolon)"
//                 name="questionsAsked"
//                 value={rnd.questionsAsked}
//                 onChange={(e) => handleRoundChange(idx, e)}
//                 required
//               />
//               <label>Difficulty</label>
//               <select
//                 name="difficultyRating"
//                 value={rnd.difficultyRating}
//                 onChange={(e) => handleRoundChange(idx, e)}
//                 className="border px-2 py-1 rounded w-full mb-2"
//               >
//                 {[1, 2, 3, 4, 5].map((i) => (
//                   <option key={i} value={i}>
//                     {i}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           ))}
//           <button
//             type="button"
//             className="text-blue-500 mb-2"
//             onClick={addRound}
//           >
//             + Add Another Round
//           </button>
//           <Input
//             label="Overall Experience Rating (1-5)"
//             name="overallRating"
//             type="number"
//             min="1"
//             max="5"
//             value={form.overallRating}
//             onChange={handleChange}
//             required
//           />
//           <label className="block my-2">
//             <input
//               type="checkbox"
//               name="isAnonymous"
//               checked={form.isAnonymous}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, isAnonymous: e.target.checked }))
//               }
//               className="mr-1"
//             />
//             Submit anonymously
//           </label>
//           {error && <div className="text-red-600 mb-2">{error}</div>}
//           {alert && <div className="text-green-600 mb-2">{alert}</div>}
//           <Button type="submit" className="w-full">
//             Submit Experience
//           </Button>
//         </form>
//       </Card>
//     </div>
//   );
// };

// export default SubmitInterviewPage;


import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const SubmitInterviewPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const preSelectedCompany = params.get("companyId");

  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [companySearch, setCompanySearch] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [form, setForm] = useState({
    company: preSelectedCompany || "",
    interviewDate: "",
    rounds: [{ roundType: "", questionsAsked: "", difficultyRating: 3 }],
    overallRating: 3,
    isAnonymous: true,
  });
  const [error, setError] = useState("");
  const [alert, setAlert] = useState("");

  useEffect(() => {
    const fetchAllCompanies = async () => {
      try {
        // First, fetch first page to get total count
        const firstPage = await api.get("/companies?page=1&limit=1000");
        
        if (firstPage.data.pagination) {
          const totalItems = firstPage.data.pagination.totalItems;
          const itemsPerPage = firstPage.data.pagination.itemsPerPage;
          const totalPages = firstPage.data.pagination.totalPages;
          
          let allCompanies = firstPage.data.companies || [];
          
          // If there are more pages, fetch them all
          if (totalPages > 1) {
            const promises = [];
            for (let page = 2; page <= totalPages; page++) {
              promises.push(api.get(`/companies?page=${page}&limit=1000`));
            }
            const results = await Promise.all(promises);
            results.forEach(result => {
              if (result.data.companies) {
                allCompanies = [...allCompanies, ...result.data.companies];
              }
            });
          }
          
          // Sort companies alphabetically for better UX
          allCompanies.sort((a, b) => 
            (a.companyName || "").localeCompare(b.companyName || "")
          );
          
          setCompanies(allCompanies);
          setFilteredCompanies(allCompanies);
        } else {
          // Fallback for old format
          const companies = Array.isArray(firstPage.data) 
            ? firstPage.data 
            : (firstPage.data.companies || []);
          companies.sort((a, b) => 
            (a.companyName || "").localeCompare(b.companyName || "")
          );
          setCompanies(companies);
          setFilteredCompanies(companies);
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
        toast.error("Failed to load companies");
        setCompanies([]);
      }
    };
    
    fetchAllCompanies();
  }, []);

  const companyNameLookup = (id) => {
    const company = companies.find((c) => c._id === id);
    return company ? company.companyName : id;
  };

  // Filter companies based on search
  useEffect(() => {
    if (!companySearch.trim()) {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter((company) =>
        company.companyName?.toLowerCase().includes(companySearch.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [companySearch, companies]);

  const handleCompanySelect = (companyId, companyName) => {
    setForm((prev) => ({ ...prev, company: companyId }));
    setCompanySearch(companyName);
    setShowCompanyDropdown(false);
  };

  const handleRoundChange = (idx, e) => {
    const newRounds = form.rounds.map((r, i) =>
      i === idx ? { ...r, [e.target.name]: e.target.value } : r
    );
    setForm((f) => ({ ...f, rounds: newRounds }));
  };

  const addRound = () =>
    setForm((f) => ({
      ...f,
      rounds: [
        ...f.rounds,
        { roundType: "", questionsAsked: "", difficultyRating: 3 },
      ],
    }));

  const removeRound = (idx) =>
    setForm((f) => ({ ...f, rounds: f.rounds.filter((_, i) => i !== idx) }));

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setAlert("");
    
    // Frontend validation
    if (!form.company) {
      toast.error("Please select a company");
      return;
    }
    if (form.rounds.some(r => !r.roundType || !r.questionsAsked)) {
      toast.error("Please fill all round details");
      return;
    }
    
    const loadingToast = toast.loading("Submitting interview experience...");
    try {
      const payload = {
        ...form,
        rounds: form.rounds.map((r) => ({
          ...r,
          questionsAsked: r.questionsAsked
            .split(";")
            .map((q) => q.trim())
            .filter(Boolean),
          difficultyRating: Number(r.difficultyRating),
        })),
        overallRating: Number(form.overallRating),
        interviewDate: form.interviewDate || undefined,
      };
      await api.post("/interviews", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlert("🎉 Experience submitted successfully!");
      toast.success("Interview experience submitted successfully!", { id: loadingToast });
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Submission failed";
      setError(errorMsg);
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 animate-fadeIn">
      <Card className="shadow-2xl p-6 transition-all duration-500 transform hover:scale-[1.01]">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          Share Your Interview Experience
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Company</label>
            {!preSelectedCompany ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Search and select company..."
                  value={companySearch}
                  onChange={(e) => {
                    setCompanySearch(e.target.value);
                    setShowCompanyDropdown(true);
                  }}
                  onFocus={() => setShowCompanyDropdown(true)}
                  className="border px-3 py-2 rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {showCompanyDropdown && filteredCompanies.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredCompanies.map((c) => (
                      <div
                        key={c._id}
                        onClick={() => handleCompanySelect(c._id, c.companyName)}
                        className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                          form.company === c._id ? "bg-blue-100" : ""
                        }`}
                      >
                        <div className="font-medium text-gray-900">{c.companyName}</div>
                        {c.address && (
                          <div className="text-xs text-gray-500">📍 {c.address}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {showCompanyDropdown && companySearch && filteredCompanies.length === 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500">
                    No companies found matching "{companySearch}"
                  </div>
                )}
                <input
                  type="hidden"
                  name="company"
                  value={form.company}
                  required
                />
                {form.company && (
                  <div className="mt-2 text-sm text-green-600">
                    ✓ Selected: {companyNameLookup(form.company)}
                  </div>
                )}
                {showCompanyDropdown && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowCompanyDropdown(false)}
                  ></div>
                )}
              </div>
            ) : (
              <>
                <input type="hidden" name="company" value={form.company} />
                <div className="mb-3 text-gray-600">
                  Interviewing at:{" "}
                  <span className="font-semibold text-gray-900">
                    {companyNameLookup(preSelectedCompany)}
                  </span>
                </div>
              </>
            )}
          </div>

          <Input
            label="Interview Date"
            type="date"
            name="interviewDate"
            value={form.interviewDate}
            onChange={handleChange}
          />

          <hr className="my-4" />

          {form.rounds.map((rnd, idx) => (
            <div
              key={idx}
              className="mb-4 p-3 border rounded-lg bg-gray-50 animate-fadeIn delay-100"
            >
              <div className="flex justify-between items-center text-sm font-medium mb-2">
                <span className="text-gray-700">Round {idx + 1}</span>
                {form.rounds.length > 1 && (
                  <button
                    onClick={() => removeRound(idx)}
                    type="button"
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <Input
                label="Type (Technical/HR/Managerial...)"
                name="roundType"
                value={rnd.roundType}
                onChange={(e) => handleRoundChange(idx, e)}
                required
              />
              <Input
                label="Questions (separate by semicolon)"
                name="questionsAsked"
                value={rnd.questionsAsked}
                onChange={(e) => handleRoundChange(idx, e)}
                required
              />
              <label className="block mb-1 text-sm text-gray-700">
                Difficulty
              </label>
              <select
                name="difficultyRating"
                value={rnd.difficultyRating}
                onChange={(e) => handleRoundChange(idx, e)}
                className="border px-3 py-2 rounded w-full"
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button
            type="button"
            onClick={addRound}
            className="text-blue-500 text-sm hover:underline"
          >
            + Add Another Round
          </button>

          <Input
            label="Overall Experience Rating (1-5)"
            name="overallRating"
            type="number"
            min="1"
            max="5"
            value={form.overallRating}
            onChange={handleChange}
            required
          />

          <label className="flex items-center text-sm mt-2">
            <input
              type="checkbox"
              name="isAnonymous"
              checked={form.isAnonymous}
              onChange={(e) =>
                setForm((f) => ({ ...f, isAnonymous: e.target.checked }))
              }
              className="mr-2"
            />
            Submit anonymously
          </label>

          {error && <div className="text-red-600 text-sm">{error}</div>}
          {alert && <div className="text-green-600 text-sm">{alert}</div>}

          <Button type="submit" className="w-full mt-3">
            🚀 Submit Experience
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SubmitInterviewPage;
