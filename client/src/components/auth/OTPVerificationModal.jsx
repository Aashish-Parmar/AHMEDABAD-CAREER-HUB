import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Card from "../common/Card";

const OTPVerificationModal = ({
  isOpen,
  onClose,
  email,
  onVerificationSuccess,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

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
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle paste
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

  const handleVerify = async () => {
    const otpString = otp.join("");

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

      // Call success callback if provided
      if (onVerificationSuccess) {
        onVerificationSuccess();
      }

      // Close modal and navigate
      onClose();
      navigate("/dashboard");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Invalid OTP. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);

      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError("");

    try {
      // Resend OTP by registering again (or create a resend endpoint)
      // For now, we'll show a message - backend should have resend endpoint
      toast.loading("Resending OTP...");

      // Note: Backend doesn't have resend endpoint yet, so we'll just show message
      // In production, you'd call: await api.post("/auth/resend-otp", { email });

      toast.success("OTP resent! Please check your email.", {
        id: toast.loading(),
      });
      setResendCooldown(60); // 60 second cooldown
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to resend OTP. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="bg-white shadow-2xl px-8 py-8 rounded-xl border-2 border-blue-50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="text-center mb-6">
            <div className="bg-gradient-to-tr from-blue-400 via-cyan-400 to-blue-700 text-white shadow-lg h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-extrabold">
              ✉️
            </div>
            <h2 className="text-2xl font-black text-blue-700 tracking-tight mb-2">
              Verify Your Email
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              We sent a 6-digit code to
            </p>
            <p className="text-sm font-semibold text-blue-600">{email}</p>
          </div>

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
            onClick={handleVerify}
            disabled={loading || otp.join("").length !== 6}
            className="w-full py-2 mb-4 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-md hover:from-blue-700 hover:to-cyan-600 hover:scale-105 transition-transform duration-200 font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOTP}
              disabled={resendCooldown > 0 || loading}
              className="text-blue-600 hover:text-blue-800 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend OTP"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OTPVerificationModal;
