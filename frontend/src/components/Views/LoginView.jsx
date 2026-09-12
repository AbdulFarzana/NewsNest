import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft
} from "lucide-react";

const API_BASE_URL = "https://news-nest-eta.vercel.app";

export default function LoginView({ onLoginSuccess }) {

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Signup OTP
  const [otpStep, setOtpStep] = useState(false);

  // Forgot password
  const [forgotPassword, setForgotPassword] = useState(false);

  // Reset password
  const [resetStep, setResetStep] = useState(false);


  // =====================================================
  // SWITCH LOGIN / SIGNUP
  // =====================================================

  const switchMode = (newMode) => {

    setMode(newMode);

    setForgotPassword(false);
    setResetStep(false);
    setOtpStep(false);

    setError("");
    setMessage("");

    setPassword("");
    setConfirmPassword("");
    setOtp("");
  };


  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim(),
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.message || "Invalid email or password"
        );

        return;
      }

      setMessage("Login successful");

      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }

    } catch (error) {

      console.error("Login error:", error);

      setError("Unable to connect to server");

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // SIGNUP
  // =====================================================

  const handleSignup = async (e) => {

    e.preventDefault();

    setError("");
    setMessage("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {

      setError("All fields are required");
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {

      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {

      setError(
        "Password must contain at least 8 characters"
      );

      return;
    }

    if (!/[A-Z]/.test(password)) {

      setError(
        "Password must contain at least one uppercase letter"
      );

      return;
    }

    if (!/[a-z]/.test(password)) {

      setError(
        "Password must contain at least one lowercase letter"
      );

      return;
    }

    if (!/[0-9]/.test(password)) {

      setError(
        "Password must contain at least one number"
      );

      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(password)) {

      setError(
        "Password must contain at least one special character"
      );

      return;
    }

    if (password !== confirmPassword) {

      setError("Passwords do not match");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            confirmPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.message || "Signup failed"
        );

        return;
      }

      setMessage(
        data.message ||
        "OTP sent successfully to your email"
      );

      setOtpStep(true);

    } catch (error) {

      console.error("Signup error:", error);

      setError("Unable to connect to server");

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // VERIFY SIGNUP OTP
  // =====================================================

  const handleVerifyOtp = async (e) => {

    e.preventDefault();

    setError("");
    setMessage("");

    if (otp.length !== 6) {

      setError("Please enter the 6-digit OTP");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            otp,
            password,
            confirmPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.message || "Invalid OTP"
        );

        return;
      }

      setMessage(
        "Registration successful. Please sign in."
      );

      setOtp("");
      setPassword("");
      setConfirmPassword("");

      setOtpStep(false);
      setMode("login");

    } catch (error) {

      console.error(
        "OTP verification error:",
        error
      );

      setError("Unable to connect to server");

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  const handleForgotPassword = async (e) => {

    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {

      setError(
        "Please enter your email address"
      );

      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {

      setError(
        "Please enter a valid email address"
      );

      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.message ||
          "Unable to send reset OTP"
        );

        return;
      }

      setMessage(
        data.message ||
        "Password reset OTP sent to your email"
      );

      setResetStep(true);
      setOtp("");

    } catch (error) {

      console.error(
        "Forgot password error:",
        error
      );

      setError("Unable to connect to server");

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // RESET PASSWORD
  // =====================================================

  const handleResetPassword = async (e) => {

    e.preventDefault();

    setError("");
    setMessage("");

    if (otp.length !== 6) {

      setError(
        "Please enter the 6-digit OTP"
      );

      return;
    }

    if (!password) {

      setError(
        "Please enter your new password"
      );

      return;
    }

    if (password.length < 8) {

      setError(
        "Password must contain at least 8 characters"
      );

      return;
    }

    if (!/[A-Z]/.test(password)) {

      setError(
        "Password must contain at least one uppercase letter"
      );

      return;
    }

    if (!/[a-z]/.test(password)) {

      setError(
        "Password must contain at least one lowercase letter"
      );

      return;
    }

    if (!/[0-9]/.test(password)) {

      setError(
        "Password must contain at least one number"
      );

      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(password)) {

      setError(
        "Password must contain at least one special character"
      );

      return;
    }

    if (password !== confirmPassword) {

      setError(
        "Passwords do not match"
      );

      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim(),
            otp,
            password,
            confirmPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.message ||
          "Unable to reset password"
        );

        return;
      }

      setMessage(
        data.message ||
        "Password reset successful"
      );

      setForgotPassword(false);
      setResetStep(false);

      setMode("login");

      setOtp("");
      setPassword("");
      setConfirmPassword("");

    } catch (error) {

      console.error(
        "Reset password error:",
        error
      );

      setError(
        "Unable to connect to server"
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="min-h-screen w-full flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="bg-[#111827] border border-[#1f2937] rounded-3xl p-7 shadow-2xl">

          {/* =====================================================
              FORGOT PASSWORD
          ===================================================== */}

          {forgotPassword ? (

            <>

              {/* Heading */}

              <div className="text-center mb-7">

                <h1 className="text-2xl font-bold text-white">

                  {resetStep
                    ? "Reset Password"
                    : "Forgot Password"}

                </h1>

                <p className="text-sm text-gray-400 mt-2">

                  {resetStep
                    ? "Enter the OTP and create your new password"
                    : "Enter your email to receive a password reset OTP"}

                </p>

              </div>


              {/* Messages */}

              {error && (

                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">

                  {error}

                </div>

              )}

              {message && (

                <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">

                  {message}

                </div>

              )}


              {/* =====================================================
                  FORGOT PASSWORD EMAIL
              ===================================================== */}

              {!resetStep ? (

                <form
                  onSubmit={handleForgotPassword}
                  className="space-y-5"
                >

                  <div>

                    <label className="text-xs text-gray-400">

                      Email

                    </label>

                    <div className="relative mt-2">

                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="Enter your email"
                        className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-indigo-500"
                      />

                    </div>

                  </div>


                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold"
                  >

                    {loading
                      ? "Sending OTP..."
                      : "Send Reset OTP"}

                  </button>


                  <button
                    type="button"
                    onClick={() => {

                      setForgotPassword(false);
                      setResetStep(false);

                      setError("");
                      setMessage("");

                      setOtp("");
                      setPassword("");
                      setConfirmPassword("");

                    }}
                    className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm"
                  >

                    <ArrowLeft size={16} />

                    Back to Login

                  </button>

                </form>

              ) : (

                /* =====================================================
                   RESET PASSWORD FORM
                ===================================================== */

                <>

                  <form
                    onSubmit={handleResetPassword}
                    className="space-y-5"
                  >

                    {/* OTP */}

                    <div>

                      <label className="text-xs text-gray-400">

                        Reset OTP

                      </label>

                      <div className="relative mt-2">

                        <Mail
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                          size={18}
                        />

                        <input
                          type="text"
                          value={otp}
                          onChange={(e) =>
                            setOtp(
                              e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 6)
                            )
                          }
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-indigo-500"
                        />

                      </div>

                    </div>


                    {/* New Password */}

                    <div>

                      <label className="text-xs text-gray-400">

                        New Password

                      </label>

                      <div className="relative mt-2">

                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                          size={18}
                        />

                        <input
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          value={password}
                          onChange={(e) =>
                            setPassword(e.target.value)
                          }
                          placeholder="Create new password"
                          className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl pl-10 pr-12 py-3 text-white outline-none focus:border-indigo-500"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(!showPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >

                          {showPassword
                            ? <EyeOff size={18} />
                            : <Eye size={18} />}

                        </button>

                      </div>

                    </div>


                    {/* Password Requirements */}

                    <div className="space-y-1 text-xs">

                      <p className={
                        password.length >= 8
                          ? "text-green-400"
                          : "text-gray-500"
                      }>

                        {password.length >= 8
                          ? "✓"
                          : "○"}{" "}

                        At least 8 characters

                      </p>


                      <p className={
                        /[A-Z]/.test(password)
                          ? "text-green-400"
                          : "text-gray-500"
                      }>

                        {/[A-Z]/.test(password)
                          ? "✓"
                          : "○"}{" "}

                        One uppercase letter

                      </p>


                      <p className={
                        /[a-z]/.test(password)
                          ? "text-green-400"
                          : "text-gray-500"
                      }>

                        {/[a-z]/.test(password)
                          ? "✓"
                          : "○"}{" "}

                        One lowercase letter

                      </p>


                      <p className={
                        /[0-9]/.test(password)
                          ? "text-green-400"
                          : "text-gray-500"
                      }>

                        {/[0-9]/.test(password)
                          ? "✓"
                          : "○"}{" "}

                        One number

                      </p>


                      <p className={
                        /[!@#$%^&*(),.?":{}|<>_\-]/.test(password)
                          ? "text-green-400"
                          : "text-gray-500"
                      }>

                        {/[!@#$%^&*(),.?":{}|<>_\-]/.test(password)
                          ? "✓"
                          : "○"}{" "}

                        One special character

                      </p>

                    </div>


                    {/* Confirm Password */}

                    <div>

                      <label className="text-xs text-gray-400">

                        Confirm New Password

                      </label>

                      <div className="relative mt-2">

                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                          size={18}
                        />

                        <input
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(
                              e.target.value
                            )
                          }
                          placeholder="Confirm new password"
                          className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl pl-10 pr-12 py-3 text-white outline-none focus:border-indigo-500"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              !showConfirmPassword
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >

                          {showConfirmPassword
                            ? <EyeOff size={18} />
                            : <Eye size={18} />}

                        </button>

                      </div>

                    </div>


                    {/* Reset Button */}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold"
                    >

                      {loading
                        ? "Resetting Password..."
                        : "Reset Password"}

                    </button>


                    {/* Back */}

                    <button
                      type="button"
                      onClick={() => {

                        setResetStep(false);
                        setForgotPassword(false);

                        setOtp("");
                        setPassword("");
                        setConfirmPassword("");

                        setError("");
                        setMessage("");

                      }}
                      className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm"
                    >

                      <ArrowLeft size={16} />

                      Back to Login

                    </button>

                  </form>

                </>

              )}

            </>

          ) : (

            /* =====================================================
               NORMAL LOGIN / SIGNUP
            ===================================================== */

            <>

              {/* Heading */}

              <div className="text-center mb-7">

                <h1 className="text-2xl font-bold text-white">

                  {otpStep
                    ? "Verify Your Email"
                    : mode === "login"
                      ? "Welcome Back"
                      : "Create Account"}

                </h1>

                <p className="text-sm text-gray-400 mt-2">

                  {otpStep
                    ? "Enter the OTP sent to your email"
                    : mode === "login"
                      ? "Sign in to continue to NewsNest"
                      : "Create your NewsNest account"}

                </p>

              </div>


              {/* Messages */}

              {error && (

                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">

                  {error}

                </div>

              )}

              {message && (

                <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">

                  {message}

                </div>

              )}


              {/* =====================================================
                  SIGNUP OTP
              ===================================================== */}

              {otpStep ? (

                <form
                  onSubmit={handleVerifyOtp}
                  className="space-y-5"
                >

                  <div>

                    <label className="text-xs text-gray-400">

                      Verification OTP

                    </label>

                    <div className="relative mt-2">

                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                      />

                      <input
                        type="text"
                        value={otp}
                        onChange={(e) =>
                          setOtp(
                            e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 6)
                          )
                        }
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-indigo-500"
                      />

                    </div>

                  </div>


                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold"
                  >

                    {loading
                      ? "Verifying..."
                      : "Verify OTP"}

                  </button>


                  <button
                    type="button"
                    onClick={() => {

                      setOtpStep(false);
                      setOtp("");
                      setError("");
                      setMessage("");

                    }}
                    className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm"
                  >

                    <ArrowLeft size={16} />

                    Back

                  </button>

                </form>

              ) : (

                <>

                  {/* =====================================================
                      LOGIN
                  ===================================================== */}

                  {mode === "login" && (

                    <form
                      onSubmit={handleLogin}
                      className="space-y-5"
                    >

                      {/* Email */}

                      <div>

                        <label className="text-xs text-gray-400">

                          Email

                        </label>

                        <div className="relative mt-2">

                          <Mail
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={18}
                          />

                          <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                              setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-indigo-500"
                          />

                        </div>

                      </div>


                      {/* Password */}

                      <div>

                        <label className="text-xs text-gray-400">

                          Password

                        </label>

                        <div className="relative mt-2">

                          <Lock
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={18}
                          />

                          <input
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            value={password}
                            onChange={(e) =>
                              setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl pl-10 pr-12 py-3 text-white outline-none focus:border-indigo-500"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(!showPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                          >

                            {showPassword
                              ? <EyeOff size={18} />
                              : <Eye size={18} />}

                          </button>

                        </div>

                      </div>


                      {/* Forgot Password */}

                      <div className="text-right">

                        <button
                          type="button"
                          onClick={() => {

                            setForgotPassword(true);
                            setResetStep(false);

                            setError("");
                            setMessage("");

                            setPassword("");
                            setConfirmPassword("");
                            setOtp("");

                          }}
                          className="text-xs text-indigo-400 hover:text-indigo-300"
                        >

                          Forgot Password?

                        </button>

                      </div>


                      {/* Login Button */}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold"
                      >

                        {loading
                          ? "Signing in..."
                          : "Sign In"}

                      </button>

                    </form>

                  )}


                  {/* =====================================================
                      SIGNUP
                  ===================================================== */}

                  {mode === "signup" && (

                    <form
                      onSubmit={handleSignup}
                      className="space-y-4"
                    >

                      {/* Name */}

                      <div>

                        <label className="text-xs text-gray-400">

                          Name

                        </label>

                        <div className="relative mt-2">

                          <User
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={18}
                          />

                          <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                              setName(e.target.value)
                            }
                            placeholder="Enter your name"
                            className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-indigo-500"
                          />

                        </div>

                      </div>


                      {/* Email */}

                      <div>

                        <label className="text-xs text-gray-400">

                          Email

                        </label>

                        <div className="relative mt-2">

                          <Mail
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={18}
                          />

                          <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                              setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-indigo-500"
                          />

                        </div>

                      </div>


                      {/* Password */}

                      <div>

                        <label className="text-xs text-gray-400">

                          Password

                        </label>

                        <div className="relative mt-2">

                          <Lock
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={18}
                          />

                          <input
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            value={password}
                            onChange={(e) =>
                              setPassword(e.target.value)
                            }
                            placeholder="Create a password"
                            className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl pl-10 pr-12 py-3 text-white outline-none focus:border-indigo-500"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(!showPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                          >

                            {showPassword
                              ? <EyeOff size={18} />
                              : <Eye size={18} />}

                          </button>

                        </div>

                      </div>


                      {/* Password Requirements */}

                      <div className="space-y-1 text-xs">

                        <p className={
                          password.length >= 8
                            ? "text-green-400"
                            : "text-gray-500"
                        }>

                          {password.length >= 8
                            ? "✓"
                            : "○"}{" "}

                          At least 8 characters

                        </p>


                        <p className={
                          /[A-Z]/.test(password)
                            ? "text-green-400"
                            : "text-gray-500"
                        }>

                          {/[A-Z]/.test(password)
                            ? "✓"
                            : "○"}{" "}

                          One uppercase letter

                        </p>


                        <p className={
                          /[a-z]/.test(password)
                            ? "text-green-400"
                            : "text-gray-500"
                        }>

                          {/[a-z]/.test(password)
                            ? "✓"
                            : "○"}{" "}

                          One lowercase letter

                        </p>


                        <p className={
                          /[0-9]/.test(password)
                            ? "text-green-400"
                            : "text-gray-500"
                        }>

                          {/[0-9]/.test(password)
                            ? "✓"
                            : "○"}{" "}

                          One number

                        </p>


                        <p className={
                          /[!@#$%^&*(),.?":{}|<>_\-]/.test(password)
                            ? "text-green-400"
                            : "text-gray-500"
                        }>

                          {/[!@#$%^&*(),.?":{}|<>_\-]/.test(password)
                            ? "✓"
                            : "○"}{" "}

                          One special character

                        </p>

                      </div>


                      {/* Confirm Password */}

                      <div>

                        <label className="text-xs text-gray-400">

                          Confirm Password

                        </label>

                        <div className="relative mt-2">

                          <Lock
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={18}
                          />

                          <input
                            type={
                              showConfirmPassword
                                ? "text"
                                : "password"
                            }
                            value={confirmPassword}
                            onChange={(e) =>
                              setConfirmPassword(
                                e.target.value
                              )
                            }
                            placeholder="Confirm password"
                            className="w-full bg-[#151c2c] border border-[#1f2937] rounded-xl pl-10 pr-12 py-3 text-white outline-none focus:border-indigo-500"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(
                                !showConfirmPassword
                              )
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                          >

                            {showConfirmPassword
                              ? <EyeOff size={18} />
                              : <Eye size={18} />}

                          </button>

                        </div>

                      </div>


                      {/* Signup Button */}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold"
                      >

                        {loading
                          ? "Sending OTP..."
                          : "Create Account"}

                      </button>

                    </form>

                  )}


                  {/* =====================================================
                      SWITCH LOGIN / SIGNUP
                  ===================================================== */}

                  <div className="text-center mt-6">

                    {mode === "login" ? (

                      <p className="text-sm text-gray-400">

                        Don't have an account?{" "}

                        <button
                          type="button"
                          onClick={() =>
                            switchMode("signup")
                          }
                          className="text-indigo-400 hover:text-indigo-300 font-semibold"
                        >

                          Sign Up

                        </button>

                      </p>

                    ) : (

                      <p className="text-sm text-gray-400">

                        Already have an account?{" "}

                        <button
                          type="button"
                          onClick={() =>
                            switchMode("login")
                          }
                          className="text-indigo-400 hover:text-indigo-300 font-semibold"
                        >

                          Sign In

                        </button>

                      </p>

                    )}

                  </div>

                </>

              )}

            </>

          )}

        </div>

      </div>

    </div>
  );
}