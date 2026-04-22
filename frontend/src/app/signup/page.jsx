"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { GoogleLogin } from "@react-oauth/google";
import { useProfile } from "@/lib/useProfile";

const GoogleIcon = () => (

  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const CATEGORIES = ["Entrepreneur", "Student", "Professional", "Freelancer", "Investor"];

const PERKS = [
  { icon: "⭐", title: "+50 BizPoints", desc: "Just for completing your profile" },
  { icon: "🤝", title: "Smart Networking", desc: "Connect with the right people instantly" },
  { icon: "🚀", title: "Real Collaborations", desc: "Join projects and build together" },
  { icon: "🏆", title: "Climb the Tiers", desc: "Earn rewards as you engage" },
];

export default function SignupPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "", category: "" });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useProfile();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/user/google-login", { 
        idToken: credentialResponse.credential 
      });
      login(data.token, data.user);
      router.push("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Google sign-up failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/user/signup", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        category: form.category || "Other",
      });

      // Store auth info
      login(data.token, data.user);

      // Redirect to profile
      router.push("/profile");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans antialiased" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Syne:wght@600;700;800&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        @keyframes float  { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-10px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-7px)}  }
        @keyframes float3 { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-5px)}  }
        .float-a { animation: float  5s ease-in-out infinite; }
        .float-b { animation: float2 4s ease-in-out infinite 1s; }
        .float-c { animation: float3 6s ease-in-out infinite 0.5s; }
        @keyframes blob { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
        .blob { animation: blob 8s ease-in-out infinite; }
        @keyframes spin  { from{transform:rotate(0deg)}  to{transform:rotate(360deg)}  }
        @keyframes spinr { from{transform:rotate(0deg)}  to{transform:rotate(-360deg)} }
        .orbit-1 { animation: spin  20s linear infinite; }
        .orbit-2 { animation: spinr 30s linear infinite; }
        @keyframes fadein { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fadein    { animation: fadein 0.6s ease forwards; }
        .fadein-d1 { animation: fadein 0.6s ease 0.1s forwards; opacity:0; }
        .fadein-d2 { animation: fadein 0.6s ease 0.2s forwards; opacity:0; }
        .fadein-d3 { animation: fadein 0.6s ease 0.3s forwards; opacity:0; }
        input:focus, select:focus { outline: none; }
        .input-field {
          width:100%; padding: 0.75rem 1rem 0.75rem 2.6rem;
          border-radius:0.75rem; border:1px solid #e2e8f0;
          font-size:0.875rem; color:#1e293b;
          background:#f8fafc; transition: all 0.2s ease;
        }
        .input-field:focus { background:#fff; box-shadow:0 0 0 2px #3b82f6; border-color:transparent; }
        .input-field::placeholder { color:#94a3b8; }
        .btn-primary {
          background: linear-gradient(135deg,#2563eb,#3b82f6);
          box-shadow: 0 4px 24px rgba(37,99,235,0.32);
          transition: all 0.2s ease;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg,#1d4ed8,#2563eb);
          box-shadow: 0 6px 32px rgba(37,99,235,0.42);
          transform: translateY(-1px);
        }
        .role-pill { transition: all 0.18s ease; cursor:pointer; }
        .role-pill:hover { border-color:#3b82f6; color:#2563eb; background:#eff6ff; }
        .role-pill.active { background:#2563eb; color:#fff; border-color:#2563eb; }
        .perk-card { transition: transform 0.25s ease; }
        .perk-card:hover { transform: translateY(-3px); }
      `}</style>

      {/* ── LEFT: Form Panel ── */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 py-10 lg:px-14 bg-white overflow-y-auto">
        <div className="max-w-lg w-full mx-auto">

          {/* Logo */}
          <div className="fadein mb-8 flex items-center gap-2.5">
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
          <div className="fadein-d1 mb-7">
            <h1 className="font-display text-3xl font-700 text-slate-900 mb-2">Create your account 🚀</h1>
            <p className="text-slate-500 text-sm">Join BizCircle free and start earning BizPoints from day one.</p>
          </div>

          <form onSubmit={handleSignup} className="fadein-d2 space-y-5">

            {/* Google */}
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google signup failed")}
                theme="outline"
                size="large"
                shape="pill"
                width="100%"
                text="signup_with"
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200"/>
              <span className="text-xs text-slate-400 font-medium">or sign up with email</span>
              <div className="flex-1 h-px bg-slate-200"/>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
                </svg>
                {error}
              </div>
            )}

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">First name</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  </div>
                  <input type="text" value={form.firstName} onChange={set("firstName")} placeholder="Alex" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last name</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  </div>
                  <input type="text" value={form.lastName} onChange={set("lastName")} placeholder="Morgan" className="input-field" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className="input-field" />
              </div>
            </div>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="••••••••" className="input-field pr-10" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPass
                      ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm password</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <input type={showConfirm ? "text" : "password"} value={form.confirm} onChange={set("confirm")} placeholder="••••••••" className="input-field pr-10" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showConfirm
                      ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>
            </div>

            {/* Role Picker */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">I am a...</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, category: r }))}
                    className={`role-pill text-xs font-semibold px-3.5 py-1.5 rounded-xl border ${form.category === r ? "active" : "border-slate-200 text-slate-600 bg-white"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all duration-200 ${agreed ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white group-hover:border-blue-400"}`}
              >
                {agreed && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>}
              </div>
              <span className="text-sm text-slate-500 leading-relaxed">
                I agree to BizCircle&apos;s{" "}
                <a href="#" className="text-blue-600 font-semibold hover:underline">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 font-semibold hover:underline">Privacy Policy</a>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </>
              )}
            </button>

            {/* Sign in redirect */}
            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Sign in</Link>
            </p>

          </form>
        </div>
      </div>

      {/* ── RIGHT: Visual Panel ── */}
      <div
        className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col items-center justify-center"
        style={{ background: "linear-gradient(135deg,#1d4ed8 0%,#2563eb 45%,#0ea5e9 100%)" }}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)", backgroundSize: "28px 28px" }}/>

        {/* Blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-sky-400 opacity-20 blob" style={{ filter: "blur(60px)" }}/>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400 opacity-20 blob" style={{ filter: "blur(50px)", animationDelay: "3s" }}/>

        {/* Orbit rings */}
        <div className="absolute w-72 h-72 rounded-full border border-white opacity-10 orbit-1"/>
        <div className="absolute w-[26rem] h-[26rem] rounded-full border border-white opacity-[0.06] orbit-2"/>

        <div className="relative z-10 px-10 text-center">

          {/* Icon */}
          <div className="float-a inline-block mb-6">
            <div className="w-20 h-20 rounded-3xl bg-white/15 border border-white/25 flex items-center justify-center mx-auto backdrop-blur-sm">
              <svg viewBox="0 0 20 20" fill="white" className="w-9 h-9">
                <circle cx="5" cy="10" r="2.5"/><circle cx="15" cy="5" r="2.5"/><circle cx="15" cy="15" r="2.5"/>
                <line x1="7.2" y1="9"  x2="13" y2="6.2"  stroke="white" strokeWidth="1.5"/>
                <line x1="7.2" y1="11" x2="13" y2="13.8" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>

          <h2 className="font-display text-3xl font-700 text-white mb-3 leading-tight">
            Join the Circle.<br/>Earn from the Start.
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed max-w-xs mx-auto mb-8">
            Sign up, complete your profile, and hit the ground running with BizPoints on day one.
          </p>

          {/* Perks grid */}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {PERKS.map((p) => (
              <div key={p.title} className="perk-card bg-white/12 border border-white/20 backdrop-blur-sm rounded-2xl p-3.5 text-left">
                <div className="text-xl mb-2">{p.icon}</div>
                <div className="text-white text-xs font-semibold mb-0.5">{p.title}</div>
                <div className="text-blue-200 text-xs leading-tight">{p.desc}</div>
              </div>
            ))}
          </div>

          {/* Bottom nudge */}
          <div className="float-b mt-6 inline-flex items-center gap-2 bg-white/15 border border-white/20 backdrop-blur-sm rounded-2xl px-4 py-2.5">
            <span className="text-base">🎁</span>
            <span className="text-white text-xs font-semibold">Get 50 pts just for signing up!</span>
          </div>

        </div>
      </div>

    </div>
  );
}