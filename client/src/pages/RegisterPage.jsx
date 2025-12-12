import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import OTPVerificationModal from "../components/auth/OTPVerificationModal";

// -- Custom animation styles --
const styles = `
@keyframes floatBlob3 {0%{transform:translate(0,0) scale(1);}50%{transform:translate(-20px,12px) scale(1.05);}100%{transform:translate(0,0) scale(1);}}
@keyframes floatBlob4 {0%{transform:translate(0,0) scale(1);}50%{transform:translate(20px,-22px) scale(1.13);}100%{transform:translate(0,0) scale(1);}}
@keyframes regFadeIn {0%{opacity:0;transform:translateY(32px);}100%{opacity:1;transform:translateY(0);}}
.rg-blob1 { animation: floatBlob3 7s ease-in-out infinite alternate; }
.rg-blob2 { animation: floatBlob4 9s cubic-bezier(.4,.7,.62,1.23) infinite alternate; }
.reg-fade { animation: regFadeIn .9s cubic-bezier(.36,.64,.61,1) both;}
.input-focus-glow:focus-visible { box-shadow: 0 0 2px 2px #38bdf8ee, 0 0 6px #0077ff44;}
`;

const BlobsBG = () => (
  <div className="absolute z-0 inset-0 pointer-events-none">
    <div className="rg-blob1 absolute w-72 h-60 top-[-52px] left-[-54px] rounded-full bg-gradient-to-br from-blue-400/30 via-sky-200/40 to-cyan-200/60 blur-2xl"></div>
    <div className="rg-blob2 absolute w-60 h-60 bottom-[-60px] right-[-60px] rounded-full bg-gradient-to-tr from-pink-200/50 via-blue-100/40 to-cyan-300/40 blur-3xl"></div>
  </div>
);

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    college: "",
    companyName: "",
  });
  const [error, setError] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "role" ? { college: "", companyName: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      let payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };
      if (form.role === "student") {
        payload.college = form.college;
      } else if (form.role === "recruiter") {
        payload.companyName = form.companyName;
      }
      const loadingToast = toast.loading("Creating your account...");
      const res = await api.post("/auth/register", payload);

      // Registration successful - show OTP modal
      toast.success(
        "Registration successful! Please check your email for OTP verification.",
        {
          id: loadingToast,
        }
      );

      // Store email and show OTP modal
      setRegisteredEmail(res.data.email);
      setShowOTPModal(true);
    } catch (err) {
      let errorMessage = "Registration failed. Please check your information.";
      if (err.response?.data) {
        // Handle validation errors (array of errors)
        if (
          err.response.data.errors &&
          Array.isArray(err.response.data.errors)
        ) {
          errorMessage = err.response.data.errors.join(", ");
          setError(errorMessage);
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
          setError(errorMessage);
        } else {
          setError(errorMessage);
        }
      } else {
        errorMessage =
          "Registration failed. Check your network connection and try again.";
        setError(errorMessage);
      }
      toast.error(errorMessage);
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-cyan-50 via-blue-100 to-white transition-all duration-700 overflow-x-hidden">
      <style>{styles}</style>
      <BlobsBG />

      <div className="relative z-10 w-full flex flex-col items-center reg-fade">
        {/* Logo and Heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-tr from-blue-400 via-cyan-400 to-blue-700 text-white shadow-lg h-16 w-16 rounded-full flex items-center justify-center mb-2 text-3xl font-extrabold animate-pulse-slow">
            <span>🎓</span>
          </div>
          <h2 className="text-3xl font-black text-blue-700 tracking-tight mb-0.5">
            Sign Up Free
          </h2>
          <p className="text-md text-gray-500 tracking-tight">
            Join the <b>Ahmedabad Career Hub</b>
          </p>
        </div>
        <Card className="relative bg-white/90 shadow-lg px-8 py-8 rounded-xl border-2 border-blue-50 max-w-md w-full reg-fade">
          <form onSubmit={handleSubmit}>
            <Input
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input-focus-glow"
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input-focus-glow"
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="input-focus-glow"
              required
            />
            <div className="mb-4">
              <label
                htmlFor="role"
                className="block mb-1 font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="student">Student</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>
            {form.role === "student" && (
              <Input
                label="College"
                name="college"
                value={form.college}
                onChange={handleChange}
                className="input-focus-glow"
                required
              />
            )}
            {form.role === "recruiter" && (
              <Input
                label="Company Name"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                className="input-focus-glow"
                placeholder="Enter your company name"
                required
              />
            )}
            {error && (
              <div className="text-red-600 mb-2 animate-shake">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full py-2 mt-1 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-md hover:from-blue-700 hover:to-cyan-600 hover:scale-105 transition-transform duration-200 font-bold tracking-wide"
            >
              Register
            </Button>
          </form>
          <div className="text-sm mt-4 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 underline hover:text-cyan-600 transition font-semibold"
            >
              Login
            </Link>
          </div>
        </Card>
      </div>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={registeredEmail}
        onVerificationSuccess={() => {
          setShowOTPModal(false);
          navigate("/dashboard");
        }}
      />
    </div>
  );
};

export default RegisterPage;
