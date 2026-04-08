"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/user/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userName", data.user.name);
      router.push("/profile");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans antialiased" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Syne:wght@600;700;800&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        @keyframes float  { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-10px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-7px)}  }
        .float-a { animation: float  5s ease-in-out infinite; }
        .float-b { animation: float2 4s ease-in-out infinite 1s; }
        @keyframes blob { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
        .blob { animation: blob 8s ease-in-out infinite; }
        @keyframes spin  { from{transform:rotate(0deg)}   to{transform:rotate(360deg)}   }
        @keyframes spinr { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)}  }
        .orbit-1 { animation: spin  20s linear infinite; }
        .orbit-2 { animation: spinr 30s linear infinite; }
        @keyframes fadein { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fadein    { animation: fadein 0.6s ease forwards; }
        .fadein-d1 { animation: fadein 0.6s ease 0.1s forwards; opacity:0; }
        .fadein-d2 { animation: fadein 0.6s ease 0.2s forwards; opacity:0; }
        .fadein-d3 { animation: fadein 0.6s ease 0.3s forwards; opacity:0; }
        input:focus { outline: none; }
        .btn-primary {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          box-shadow: 0 4px 24px rgba(37,99,235,0.32);
          transition: all 0.2s ease;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          box-shadow: 0 6px 32px rgba(37,99,235,0.42);
          transform: translateY(-1px);
        }
      `}</style>

      {/* ── LEFT: Form Panel ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 lg:px-16 bg-white">
        <div className="max-w-md w-full mx-auto">

          {/* Logo */}
          <div className="fadein mb-10 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md shadow-blue-200">
              <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                <circle cx="5" cy="10" r="2.5"/><circle cx="15" cy="5" r="2.5"/><circle cx="15" cy="15" r="2.5"/>
                <line x1="7.2" y1="9"  x2="13" y2="6.2"  stroke="white" strokeWidth="1.5"/>
                <line x1="7.2" y1="11" x2="13" y2="13.8" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>
            <span className="font-display text-xl font-700 text-slate-900 tracking-tight">BizCircle</span>
          </div>

          {/* Heading */}
          <div className="fadein-d1 mb-8">
            <h1 className="font-display text-3xl font-700 text-slate-900 mb-2">Welcome back 👋</h1>
            <p className="text-slate-500 text-sm">Sign in to your BizCircle account and pick up where you left off.</p>
          </div>

          {/* Form */}
          <div className="fadein-d2 space-y-5">

            {/* Google */}
            <button className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-semibold text-sm py-3 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm">
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200"/>
              <span className="text-xs text-slate-400 font-medium">or sign in with email</span>
              <div className="flex-1 h-px bg-slate-200"/>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="10" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <button className="btn-primary w-full py-3 rounded-xl text-white font-semibold text-sm">
              Sign In
            </button>

            {/* Sign up */}
            <p className="text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Create one free</Link>
            </p>

          </div>
        </div>
      </div>

      {/* ── RIGHT: Visual Panel ── */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: "linear-gradient(135deg,#1d4ed8 0%,#2563eb 40%,#0ea5e9 100%)" }}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)", backgroundSize: "28px 28px" }}/>

        {/* Blobs */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-sky-400 opacity-20 blob" style={{ filter: "blur(50px)" }}/>
        <div className="absolute bottom-10 left-0 w-56 h-56 bg-blue-300 opacity-20 blob" style={{ filter: "blur(40px)", animationDelay: "3s" }}/>

        {/* Orbit rings */}
        <div className="absolute w-80 h-80 rounded-full border border-white opacity-10 orbit-1"/>
        <div className="absolute w-[28rem] h-[28rem] rounded-full border border-white opacity-[0.06] orbit-2"/>

        {/* Content */}
        <div className="relative z-10 px-12 text-center">
          {/* Icon */}
          <div className="float-a inline-block mb-8">
            <div className="w-20 h-20 rounded-3xl bg-white/15 border border-white/25 flex items-center justify-center mx-auto backdrop-blur-sm">
              <svg viewBox="0 0 20 20" fill="white" className="w-9 h-9">
                <circle cx="5" cy="10" r="2.5"/><circle cx="15" cy="5" r="2.5"/><circle cx="15" cy="15" r="2.5"/>
                <line x1="7.2" y1="9"  x2="13" y2="6.2"  stroke="white" strokeWidth="1.5"/>
                <line x1="7.2" y1="11" x2="13" y2="13.8" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>

          <h2 className="font-display text-3xl font-700 text-white mb-3 leading-tight">
            Your Network,<br/>Your Rewards
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed max-w-xs mx-auto mb-8">
            Every connection, every collaboration — earning you BizPoints and unlocking new opportunities.
          </p>

          {/* Floating cards */}
          <div className="float-b flex flex-col gap-3 items-center">
            <div className="flex items-center gap-3 bg-white/15 border border-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 w-fit">
              <span className="text-xl">⭐</span>
              <div className="text-left">
                <div className="text-white text-sm font-semibold">+100 BizPoints</div>
                <div className="text-blue-200 text-xs">Collaboration joined!</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/15 border border-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 w-fit">
              <span className="text-xl">🤝</span>
              <div className="text-left">
                <div className="text-white text-sm font-semibold">New Connection</div>
                <div className="text-green-300 text-xs font-semibold">+10 pts earned ✓</div>
              </div>
            </div>
           
          </div>
        </div>
      </div>

    </div>
  );
}