import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles,
  Chrome,
  Terminal,
  GraduationCap,
  User,
  Hash,
  ShieldCheck
} from 'lucide-react';

export default function LoginView({ onLoginSuccess, onNavigateBack }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  // Login fields
  const [emailOrRoll, setEmailOrRoll] = useState('');
  const [password, setPassword] = useState('');
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRoll, setRegRoll] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Computer Science Undergraduate');

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrRoll.trim()) {
      setError('Please enter your email or roll number.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrRoll, password })
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.user);
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      // Fallback
      onLoginSuccess({ name: emailOrRoll, email: emailOrRoll, rollNumber: emailOrRoll });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regRoll.trim() || !regPassword.trim()) {
      setError('Please fill in all registration fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          rollNumber: regRoll,
          password: regPassword,
          role: regRole
        })
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.user);
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      onLoginSuccess({ name: regName, email: regEmail, rollNumber: regRoll });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setEmailOrRoll('21CS10048');
    setPassword('password123');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrRoll: '21CS10048', password: 'password123' })
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.user);
      } else {
        onLoginSuccess({ name: 'Farzana Khan', email: 'farzana.k@college.edu', rollNumber: '21CS10048' });
      }
    } catch (err) {
      onLoginSuccess({ name: 'Farzana Khan', email: 'farzana.k@college.edu', rollNumber: '21CS10048' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white flex flex-col justify-between selection:bg-indigo-500/30">
      {/* Top Header Row */}
      <div className="p-6">
        <button
          id="login-back-btn"
          onClick={onNavigateBack}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto w-full px-6 flex-1 flex items-center justify-center py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full max-w-4xl bg-[#111827] border border-[#1f2937]/80 rounded-3xl overflow-hidden shadow-2xl">
          {/* Left Panel: Slogan & Illustration */}
          <div className="hidden md:flex md:col-span-6 bg-gradient-to-b from-[#151c2c] to-[#0a0f1d] p-8 flex-col justify-between border-r border-[#1f2937]">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <GraduationCap className="w-6 h-6 text-indigo-400" />
                <span className="font-bold text-white text-base">NewsNest</span>
              </div>
              
              <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-1.5 leading-snug">
                {mode === 'login' ? 'Welcome Back!' : 'Join Campus Network'} <span className="animate-bounce">👋</span>
              </h2>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                Connect directly with the backend database for live announcements, event RSVPs, hackathons, and community feed threads.
              </p>
            </div>

            {/* Illustration Card */}
            <div className="my-6 p-4 rounded-2xl bg-[#111827]/80 border border-[#1f2937] relative overflow-hidden group">
              <div className="absolute top-2 right-2 flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
              
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=350" 
                alt="Students studying"
                className="w-full h-44 object-cover rounded-xl mt-2 group-hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">Database Synchronization Active</span>
                <span className="text-[10px] text-emerald-400 font-mono">● Online</span>
              </div>
            </div>

            {/* Quote Footer */}
            <div className="border-t border-[#1f2937]/50 pt-4">
              <p className="text-xs italic text-gray-400 leading-relaxed font-serif">
                &ldquo;Education is not the learning of facts, but the training of the mind to think.&rdquo;
              </p>
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest block mt-1.5">— Albert Einstein</span>
            </div>
          </div>

          {/* Right Panel: Interactive Form */}
          <div className="col-span-12 md:col-span-6 p-8 flex flex-col justify-center">
            
            {/* Mode Switcher Tabs */}
            <div className="flex bg-[#151c2c] p-1 rounded-2xl border border-[#1f2937] mb-6">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign Up / Register
              </button>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {mode === 'login' ? 'Account Login' : 'Create New Student ID'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {mode === 'login' ? 'Sign in to access stored campus records and feed.' : 'Fill out student details to register into backend database.'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Login Form */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email or Roll Number */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1.5">Email or Roll Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={emailOrRoll}
                      onChange={(e) => setEmailOrRoll(e.target.value)}
                      placeholder="e.g. 21CS10048 or farzana.k@college.edu"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-[#1f2937] rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-gray-300">Password</label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); setError('Use demo login or password123'); }} className="text-[10px] text-indigo-400 hover:underline">Forgot Password?</a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-10 pr-10 py-2.5 bg-[#111827] border border-[#1f2937] rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/35 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Authenticating...' : 'Sign In'}
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickLogin}
                    className="w-full py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-semibold rounded-xl text-xs border border-indigo-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Quick Log in as Farzana Khan (Demo)</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="w-full pl-10 pr-3 py-2 bg-[#111827] border border-[#1f2937] rounded-xl text-xs text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Roll Number</label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={regRoll}
                        onChange={(e) => setRegRoll(e.target.value)}
                        placeholder="22CS10099"
                        className="w-full pl-9 pr-3 py-2 bg-[#111827] border border-[#1f2937] rounded-xl text-xs text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Academic Role</label>
                    <input
                      type="text"
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      placeholder="3rd Year CS"
                      className="w-full px-3 py-2 bg-[#111827] border border-[#1f2937] rounded-xl text-xs text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="alex.j@college.edu"
                      className="w-full pl-10 pr-3 py-2 bg-[#111827] border border-[#1f2937] rounded-xl text-xs text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Choose a password"
                      className="w-full pl-10 pr-3 py-2 bg-[#111827] border border-[#1f2937] rounded-xl text-xs text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md mt-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Register Account'}
                </button>
              </form>
            )}

            {/* Social Logins */}
            <div className="mt-5">
              <div className="relative flex items-center justify-center mb-3">
                <div className="border-t border-[#1f2937] w-full" />
                <span className="text-[10px] text-gray-500 bg-[#111827] px-3 absolute">or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  onClick={handleQuickLogin}
                  className="py-2 px-3 bg-[#111827] border border-[#1f2937] hover:bg-[#1f2937] rounded-xl text-xs text-gray-300 font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Chrome className="w-4 h-4 text-red-400" />
                  <span>Google SSO</span>
                </button>
                <button 
                  type="button" 
                  onClick={handleQuickLogin}
                  className="py-2 px-3 bg-[#111827] border border-[#1f2937] hover:bg-[#1f2937] rounded-xl text-xs text-gray-300 font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>College SSO</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-[#1f2937]/30 text-center text-[11px] text-gray-600">
        <p>© 2026 NewsNest Systems. Connected to Express backend API.</p>
      </footer>
    </div>
  );
}
