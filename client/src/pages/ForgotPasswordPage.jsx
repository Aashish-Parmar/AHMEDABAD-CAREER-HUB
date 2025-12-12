import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const styles = `
@keyframes floatBlob1 {0%{transform:translate(0,0) scale(1);}50%{transform:translate(-20px,10px) scale(1.06);}100%{transform:translate(0,0) scale(1);}}
@keyframes floatBlob2 {0%{transform:translate(0,0) scale(1);}50%{transform:translate(25px,-8px) scale(1.08);}100%{transform:translate(0,0) scale(1);}}
@keyframes fadeInUp {0%{opacity:0;transform:translateY(40px);}100%{opacity:1;transform:translateY(0);}}
.blob1 { animation: floatBlob1 6s ease-in-out infinite alternate; }
.blob2 { animation: floatBlob2 9s ease-in-out infinite alternate; }
.fade-in-up { animation: fadeInUp 1s ease-out both; }
.input-focus-glow:focus-visible { box-shadow: 0 0 2px 2px #38bdf8ee, 0 0 6px #0077ff44;}
`;

const BlobsBG = () => (
  <div className="absolute z-0 inset-0 pointer-events-none">
    <div className="blob1 absolute w-80 h-80 top-[-60px] left-[-80px] rounded-full bg-gradient-to-br from-blue-400/40 via-sky-300/60 to-cyan-200/70 blur-2xl mix-blend-multiply"></div>
    <div className="blob2 absolute w-72 h-72 bottom-[-60px] right-[-60px] rounded-full bg-gradient-to-tr from-cyan-300/30 via-blue-400/50 to-indigo-300/40 blur-3xl mix-blend-multiply"></div>
  </div>
);

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess(true);
      toast.success("If the email exists, an OTP has been sent to your email.");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to send OTP. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-cyan-50 via-blue-100 to-white transition-all duration-700 overflow-hidden">
        <style>{styles}</style>
        <BlobsBG />

        <div className="relative z-10 max-w-md w-full px-6 sm:px-0 fade-in-up">
          <Card className="bg-white/30 backdrop-blur-md shadow-2xl px-8 py-10 rounded-2xl border border-white/40 transition duration-500 fade-in-up text-center">
            <div className="bg-gradient-to-tr from-green-400 via-emerald-400 to-green-600 text-white shadow-lg h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-extrabold">
              ✓
            </div>
            <h2 className="text-2xl font-black text-blue-700 tracking-tight mb-4">
              Check Your Email
            </h2>
            <p className="text-gray-600 mb-6">
              If an account exists with <strong>{email}</strong>, we've sent a
              password reset OTP to your email.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Please check your inbox and follow the instructions to reset your
              password.
            </p>
            <Button
              onClick={() =>
                navigate(`/reset-password?email=${encodeURIComponent(email)}`)
              }
              className="w-full py-2 mb-4 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg hover:from-blue-700 hover:to-cyan-600 hover:scale-[1.03] transition-transform duration-300 ease-out font-semibold rounded-xl"
            >
              Continue to Reset Password
            </Button>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold underline"
            >
              Back to Login
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-cyan-50 via-blue-100 to-white transition-all duration-700 overflow-hidden">
      <style>{styles}</style>
      <BlobsBG />

      <div className="relative z-10 max-w-md w-full px-6 sm:px-0 fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-tr from-blue-400 via-cyan-400 to-blue-700 text-white shadow-lg h-16 w-16 rounded-full flex items-center justify-center mb-2 text-3xl font-extrabold animate-bounce">
            🔑
          </div>
          <h2 className="text-3xl font-black text-blue-700 tracking-tight mb-1">
            Forgot Password
          </h2>
          <p className="text-md text-gray-500 tracking-tight">
            Enter your email to receive a reset code
          </p>
        </div>

        <Card className="bg-white/30 backdrop-blur-md shadow-2xl px-8 py-10 rounded-2xl border border-white/40 transition duration-500 fade-in-up">
          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              name="email"
              type="email"
              className="input-focus-glow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-3 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg hover:from-blue-700 hover:to-cyan-600 hover:scale-[1.03] transition-transform duration-300 ease-out font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Sending OTP..." : "Send Reset Code"}
            </Button>
          </form>

          <div className="text-sm mt-6 text-center">
            <Link
              to="/login"
              className="text-blue-600 underline hover:text-cyan-600 transition font-semibold"
            >
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
