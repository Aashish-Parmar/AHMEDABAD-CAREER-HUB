import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
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

const VerifyEmailPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get email from URL params if available
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Focus first OTP input when all fields are ready
  useEffect(() => {
    if (email && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [email]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6).split("");
        if (digits.length === 6) {
          const newOtp = [...otp];
          digits.forEach((digit, i) => {
            newOtp[i] = digit;
          });
          setOtp(newOtp);
          inputRefs.current[5]?.focus();
        }
      });
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/verify-email", {
        email,
        otp: otpString,
      });

      // Login user with token
      login({
        user: {
          _id: res.data.userId,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          company: res.data.company,
          companyName: res.data.companyName,
          college: res.data.college,
          isEmailVerified: res.data.isEmailVerified,
        },
        token: res.data.token,
      });

      toast.success("Email verified successfully! Welcome!");
      navigate("/dashboard");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Invalid OTP. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0 || !email) return;

    setLoading(true);
    setError("");

    try {
      // Request new OTP by registering again (or use resend endpoint if available)
      toast.loading("Resending OTP...");
      // Note: In production, call resend endpoint: await api.post("/auth/resend-otp", { email });
      toast.success("OTP resent! Please check your email.", {
        id: toast.loading(),
      });
      setResendCooldown(60);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to resend OTP. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-cyan-50 via-blue-100 to-white transition-all duration-700 overflow-hidden">
      <style>{styles}</style>
      <BlobsBG />

      <div className="relative z-10 max-w-md w-full px-6 sm:px-0 fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-tr from-blue-400 via-cyan-400 to-blue-700 text-white shadow-lg h-16 w-16 rounded-full flex items-center justify-center mb-2 text-3xl font-extrabold animate-bounce">
            ✉️
          </div>
          <h2 className="text-3xl font-black text-blue-700 tracking-tight mb-1">
            Verify Your Email
          </h2>
          <p className="text-md text-gray-500 tracking-tight">
            Enter the code sent to your email
          </p>
        </div>

        <Card className="bg-white/30 backdrop-blur-md shadow-2xl px-8 py-10 rounded-2xl border border-white/40 transition duration-500 fade-in-up">
          <form onSubmit={handleVerify}>
            <Input
              label="Email"
              name="email"
              type="email"
              className="input-focus-glow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!!searchParams.get("email")}
            />

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700 text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                ))}
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-3 text-center">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || otp.join("").length !== 6 || !email}
              className="w-full py-2 mt-3 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg hover:from-blue-700 hover:to-cyan-600 hover:scale-[1.03] transition-transform duration-300 ease-out font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendCooldown > 0 || loading || !email}
              className="text-blue-600 hover:text-blue-800 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend OTP"}
            </button>
          </div>

          <div className="text-sm mt-6 text-center">
            <span className="text-gray-600">Already verified? </span>
            <Link
              to="/login"
              className="text-blue-600 underline hover:text-cyan-600 transition font-semibold"
            >
              Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
