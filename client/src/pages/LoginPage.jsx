// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import api from "../api/axios";
// import Input from "../components/common/Input";
// import Button from "../components/common/Button";
// import Card from "../components/common/Card";

// // --- Custom Keyframes and Utility Styles (for demo, should go in your global CSS) ---
// const styles = `
// @keyframes floatBlob1 {0%{transform:translate(0,0) scale(1);}50%{transform:translate(-20px,10px) scale(1.06);}100%{transform:translate(0,0) scale(1);}}
// @keyframes floatBlob2 {0%{transform:translate(0,0) scale(1);}50%{transform:translate(25px,-8px) scale(1.08);}100%{transform:translate(0,0) scale(1);}}
// @keyframes logFadeIn {0%{opacity:0;transform:translateY(28px);}100%{opacity:1;transform:translateY(0);}}
// .blob1 { animation: floatBlob1 6s ease-in-out infinite alternate; }
// .blob2 { animation: floatBlob2 9s ease-in-out infinite alternate; }
// .log-fade { animation: logFadeIn 0.8s cubic-bezier(.36,.53,.61,.92) both; }
// .input-focus-glow:focus-visible { box-shadow: 0 0 2px 2px #38bdf8ee, 0 0 6px #0077ff44;}
// `;

// // -- Animated Blobs Background --
// const BlobsBG = () => (
//   <div className="absolute z-0 inset-0 pointer-events-none">
//     <div className="blob1 absolute w-72 h-72 top-[-50px] left-[-60px] rounded-full bg-gradient-to-br from-blue-400/40 via-sky-200/60 to-cyan-200/70 blur-2xl mix-blend-multiply"></div>
//     <div className="blob2 absolute w-56 h-56 bottom-[-40px] right-[-40px] rounded-full  bg-gradient-to-tr from-cyan-200/30 via-blue-300/50 to-indigo-200/40 blur-3xl mix-blend-multiply"></div>
//   </div>
// );

// const LoginPage = () => {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await api.post("/auth/login", {
//         email: form.email,
//         password: form.password,
//       });
//       login({
//         user: {
//           _id: res.data.userId,
//           name: res.data.name,
//           email: res.data.email,
//           role: res.data.role,
//           company: res.data.company,
//           college: res.data.college,
//         },
//         token: res.data.token,
//       });
//       navigate("/dashboard");
//     } catch (err) {
//       if (err.response && err.response.data && err.response.data.message) {
//         setError(err.response.data.message);
//       } else {
//         setError("Login failed. Check network and credentials.");
//       }
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-cyan-50 via-blue-100 to-white transition-all duration-700 overflow-x-hidden">
//       <style>{styles}</style>
//       <BlobsBG />

//       <div className="relative z-10 w-full flex flex-col items-center log-fade">
//         {/* Logo and Heading */}
//         <div className="flex flex-col items-center mb-8 fade-in-up">
//           <div className="bg-gradient-to-tr from-blue-400 via-cyan-400 to-blue-700 text-white shadow-lg h-16 w-16 rounded-full flex items-center justify-center mb-2 text-3xl font-extrabold animate-pulse-slow">
//             {/* Logo/Initial—replace with <img/> for your logo */}
//             <span>🚀</span>
//           </div>
//           <h2 className="text-3xl font-black text-blue-700 tracking-tight mb-0.5">
//             Welcome Back
//           </h2>
//           <p className="text-md text-gray-500 tracking-tight">
//             Log in to <b>Ahmedabad Career Hub</b>
//           </p>
//         </div>
//         <Card className="relative bg-white/90 shadow-xl px-8 py-8 rounded-xl border-2 border-blue-50 max-w-md w-full log-fade">
//           <form autoComplete="on" onSubmit={handleSubmit}>
//             <Input
//               label="Email"
//               name="email"
//               type="email"
//               className="input-focus-glow"
//               autoComplete="email"
//               value={form.email}
//               onChange={handleChange}
//             />
//             <Input
//               label="Password"
//               name="password"
//               type="password"
//               className="input-focus-glow"
//               autoComplete="current-password"
//               value={form.password}
//               onChange={handleChange}
//             />
//             {error && (
//               <div className="text-red-600 mb-2 animate-shake">{error}</div>
//             )}
//             <Button
//               type="submit"
//               className="w-full py-2 mt-2 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-md hover:from-blue-700 hover:to-cyan-600 hover:scale-105 transition-transform duration-200 font-bold tracking-wide"
//             >
//               Login
//             </Button>
//           </form>
//           <div className="text-sm mt-5 text-center">
//             <span className="text-gray-500">Don&apos;t have an account? </span>
//             <Link
//               to="/register"
//               className="text-blue-600 underline hover:text-cyan-600 transition font-semibold"
//             >
//               Register
//             </Link>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

// ✨ Custom styles (you can move this to index.css or tailwind config)
const styles = `
@keyframes floatBlob1 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-20px, 10px) scale(1.06); }
  100% { transform: translate(0, 0) scale(1); }
}
@keyframes floatBlob2 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(25px, -8px) scale(1.08); }
  100% { transform: translate(0, 0) scale(1); }
}
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}
.blob1 { animation: floatBlob1 6s ease-in-out infinite alternate; }
.blob2 { animation: floatBlob2 9s ease-in-out infinite alternate; }
.fade-in-up { animation: fadeInUp 1s ease-out both; }
.input-focus-glow:focus-visible {
  box-shadow: 0 0 2px 2px #38bdf8ee, 0 0 6px #0077ff44;
}
`;

const BlobsBG = () => (
  <div className="absolute z-0 inset-0 pointer-events-none">
    <div className="blob1 absolute w-80 h-80 top-[-60px] left-[-80px] rounded-full bg-gradient-to-br from-blue-400/40 via-sky-300/60 to-cyan-200/70 blur-2xl mix-blend-multiply"></div>
    <div className="blob2 absolute w-72 h-72 bottom-[-60px] right-[-60px] rounded-full bg-gradient-to-tr from-cyan-300/30 via-blue-400/50 to-indigo-300/40 blur-3xl mix-blend-multiply"></div>
  </div>
);

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      login({
        user: {
          _id: res.data.userId,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          company: res.data.company,
          college: res.data.college,
        },
        token: res.data.token,
      });
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Check network and credentials.");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-cyan-50 via-blue-100 to-white transition-all duration-700 overflow-hidden">
      <style>{styles}</style>
      <BlobsBG />

      <div className="relative z-10 max-w-md w-full px-6 sm:px-0 fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-tr from-blue-400 via-cyan-400 to-blue-700 text-white shadow-lg h-16 w-16 rounded-full flex items-center justify-center mb-2 text-3xl font-extrabold animate-bounce">
            🚀
          </div>
          <h2 className="text-3xl font-black text-blue-700 tracking-tight mb-1">
            Welcome Back
          </h2>
          <p className="text-md text-gray-500 tracking-tight">
            Log in to <b>Ahmedabad Career Hub</b>
          </p>
        </div>

        <Card className="bg-white/30 backdrop-blur-md shadow-2xl px-8 py-10 rounded-2xl border border-white/40 transition duration-500 fade-in-up">
          <form autoComplete="on" onSubmit={handleSubmit}>
            <Input
              label="Email"
              name="email"
              type="email"
              className="input-focus-glow"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              className="input-focus-glow"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
            />
            {error && (
              <div className="text-red-600 mb-2 text-sm animate-pulse">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full py-2 mt-3 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg hover:from-blue-700 hover:to-cyan-600 hover:scale-[1.03] transition-transform duration-300 ease-out font-semibold rounded-xl"
            >
              Login
            </Button>
          </form>

          <div className="text-sm mt-6 text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              to="/register"
              className="text-blue-600 underline hover:text-cyan-600 transition font-semibold"
            >
              Register
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
