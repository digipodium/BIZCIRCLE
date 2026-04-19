"use client";
import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Home", "Features", "About", "Contact"];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    title: "Professional Profiles",
    desc: "Build a rich profile showcasing your skills, experience, and goals. Make the right impression on the right people.",
    accent: "from-blue-500 to-cyan-400",
    points: "+50 pts on completion",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <circle cx="6" cy="12" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="18" cy="18" r="3" />
        <line x1="9" y1="11" x2="15" y2="7.5" /><line x1="9" y1="13" x2="15" y2="16.5" />
      </svg>
    ),
    title: "Smart Networking",
    desc: "Connect with professionals who share your vision. Every new connection you make earns you reward points.",
    accent: "from-indigo-500 to-blue-400",
    points: "+10 pts per connection",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Collaboration Opportunities",
    desc: "Discover and join projects aligned with your skills. Contributing to collaborations unlocks bonus point rewards.",
    accent: "from-sky-500 to-blue-500",
    points: "+100 pts per project",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: "BizPoints Rewards",
    desc: "Earn points for every action — connecting, collaborating, and contributing. Redeem them for platform benefits.",
    accent: "from-amber-400 to-orange-400",
    points: "Earn & flex anytime",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Create Your Profile",
    desc: "Sign up and build a professional profile. Complete it fully to earn your first 50 BizPoints instantly.",
    reward: "Earn 50 pts",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Connect & Network",
    desc: "Discover entrepreneurs, mentors, and professionals. Every new connection adds BizPoints to your balance.",
    reward: "+10 pts each",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Collaborate & Earn",
    desc: "Join projects and co-create opportunities. Active collaborations reward you with the highest BizPoints bonuses.",
    reward: "+100 pts per project",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
];



const EARN_ACTIONS = [
  { action: "Complete your profile", points: "+50 pts", icon: "✏️" },
  { action: "Make a new connection", points: "+10 pts", icon: "🤝" },
  { action: "Join a collaboration", points: "+100 pts", icon: "🚀" },
  { action: "Post an opportunity", points: "+25 pts", icon: "💼" },
  { action: "Refer a friend", points: "+30 pts", icon: "📨" },
  { action: "Endorse a skill", points: "+5 pts", icon: "⭐" },
];

const HIGHLIGHTS = [
  { icon: "⚡", label: "Free to Join" },
  { icon: "🏆", label: "Earn BizPoints" },
  { icon: "🔓", label: "Early Access Open" },
  { icon: "🤝", label: "Real Opportunities" },
];

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export default function BizCircle() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [heroRef, heroIn] = useInView(0.1);
  const [featRef, featIn] = useInView(0.1);
  const [howRef, howIn] = useInView(0.1);
  const [earnRef, earnIn] = useInView(0.1);
  const [ctaRef, ctaIn] = useInView(0.1);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-x-hidden" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Syne:wght@600;700;800&display=swap');
        :root { scroll-behavior: smooth; }
        .font-display { font-family: 'Syne', sans-serif; }
        .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .fade-up.d1 { transition-delay: 0.1s; }
        .fade-up.d2 { transition-delay: 0.2s; }
        .fade-up.d3 { transition-delay: 0.3s; }
        .fade-up.d4 { transition-delay: 0.4s; }
        .fade-up.d5 { transition-delay: 0.5s; }
        .mesh-bg {
          background: radial-gradient(ellipse 80% 60% at 60% -10%, rgba(59,130,246,0.13) 0%, transparent 70%),
                      radial-gradient(ellipse 50% 40% at 10% 80%, rgba(99,179,237,0.10) 0%, transparent 60%),
                      #fff;
        }
        .hero-card {
          backdrop-filter: blur(16px);
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(59,130,246,0.12);
        }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(59,130,246,0.13); }
        .feature-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .float-1 { animation: float 5s ease-in-out infinite; }
        .float-2 { animation: float2 4s ease-in-out infinite 1s; }
        .float-3 { animation: float 6s ease-in-out infinite 0.5s; }
        @keyframes blob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        .blob { animation: blob 8s ease-in-out infinite; }
        .pulse-dot { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .btn-primary {
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          box-shadow: 0 4px 24px rgba(37,99,235,0.32);
          transition: all 0.2s ease;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
          box-shadow: 0 6px 32px rgba(37,99,235,0.42);
          transform: translateY(-1px);
        }
        .orbit-ring {
          border: 1.5px dashed rgba(59,130,246,0.18);
          border-radius: 50%;
          animation: spin 18s linear infinite;
        }
        .orbit-ring-2 {
          border: 1.5px dashed rgba(99,179,237,0.12);
          border-radius: 50%;
          animation: spin 26s linear infinite reverse;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .glass-nav {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .reward-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .reward-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.08); }
        .earn-tile:hover { background: rgba(255,255,255,0.18); transform: translateY(-2px); }
        .earn-tile { transition: all 0.2s ease; }
      `}</style>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-nav shadow-sm border-b border-blue-50" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md shadow-blue-200">
                <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                  <circle cx="5" cy="10" r="2.5"/><circle cx="15" cy="5" r="2.5"/><circle cx="15" cy="15" r="2.5"/>
                  <line x1="7.2" y1="9" x2="13" y2="6.2" stroke="white" strokeWidth="1.5"/>
                  <line x1="7.2" y1="11" x2="13" y2="13.8" stroke="white" strokeWidth="1.5"/>
                </svg>
              </div>
              <span className="font-display text-xl font-700 text-slate-900 tracking-tight">BizCircle</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200 relative group">
                  {link}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-500 rounded transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors px-3 py-1.5">Sign In</a>
              <a href="/signup" className="btn-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl">Join Now</a>
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-blue-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {menuOpen ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden glass-nav border-t border-blue-50 px-6 py-4 space-y-3">
            {NAV_LINKS.map(l => <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-slate-700 hover:text-blue-600 py-1">{l}</a>)}
            <a href="/signup" className="block btn-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl text-center mt-2">Join Now</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="mesh-bg relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden min-h-screen flex items-center">
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-100 opacity-40 blob" style={{filter:'blur(60px)'}}/>
        <div className="absolute bottom-10 left-0 w-64 h-64 bg-sky-100 opacity-50 blob" style={{filter:'blur(50px)', animationDelay:'4s'}}/>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none">
          <div className="orbit-ring w-80 h-80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
          <div className="orbit-ring-2 w-[26rem] h-[26rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div ref={heroRef} className="relative z-10">
              <div className={`fade-up ${heroIn ? "visible" : ""}`}>
                <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
                  <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
                  Early Access Open — Join Free & Earn BizPoints
                </span>
              </div>
              <h1 className={`font-display text-5xl lg:text-6xl xl:text-7xl font-800 text-slate-900 leading-[1.05] tracking-tight mb-6 fade-up d1 ${heroIn ? "visible" : ""}`}>
                Network Smarter,<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">Earn as You Grow</span>
              </h1>
              <p className={`text-lg text-slate-500 leading-relaxed max-w-lg mb-8 fade-up d2 ${heroIn ? "visible" : ""}`}>
                BizCircle connects entrepreneurs, students, and professionals to collaborate and discover opportunities — and rewards every step of your journey with BizPoints.
              </p>
              <div className={`flex flex-wrap gap-3 mb-10 fade-up d3 ${heroIn ? "visible" : ""}`}>
                <a href="/signup" className="btn-primary text-white font-semibold px-7 py-3.5 rounded-xl flex items-center gap-2">
                  Get Started Free
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
                <a href="#features" className="flex items-center gap-2 bg-white text-slate-700 font-semibold px-7 py-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z" fill="currentColor"/></svg>
                  Learn More
                </a>
              </div>
              <div className={`flex flex-wrap gap-3 fade-up d4 ${heroIn ? "visible" : ""}`}>
                {HIGHLIGHTS.map((h) => (
                  <div key={h.label} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
                    <span className="text-sm">{h.icon}</span>
                    <span className="text-xs font-semibold text-slate-600">{h.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative flex justify-center items-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <div className="float-1 relative z-10 hero-card rounded-3xl p-6 shadow-2xl shadow-blue-100 mx-auto" style={{maxWidth:'360px'}}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-200">A</div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">Alex Morgan</div>
                      <div className="text-xs text-slate-400">Product Designer · Connector</div>
                    </div>
                    <div className="ml-auto flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
                      <svg className="w-3 h-3 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      <span className="text-xs font-bold text-amber-600">340 pts</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Building a SaaS tool for remote teams. Looking for collaborators with B2B and marketing experience.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {["SaaS","B2B","Remote","Design"].map(t => (
                      <span key={t} className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-lg">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex -space-x-2">
                      {["#3b82f6","#0ea5e9","#6366f1","#8b5cf6"].map((c, i) => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{background: c}}>{String.fromCharCode(65+i)}</div>
                      ))}
                      <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">+5</div>
                    </div>
                    <button className="btn-primary text-white text-xs font-semibold px-4 py-1.5 rounded-lg">Connect +10pts</button>
                  </div>
                </div>

                {/* Points earned floater */}
                <div className="float-2 absolute -top-4 -left-4 lg:-left-12 hero-card rounded-2xl px-4 py-3 shadow-xl z-20" style={{border:'1px solid rgba(251,191,36,0.2)'}}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white text-sm font-bold shadow">⭐</div>
                    <div>
                      <div className="font-display text-sm font-700 text-slate-900">+100 BizPoints</div>
                      <div className="text-xs text-slate-400">Collaboration joined!</div>
                    </div>
                  </div>
                </div>

                {/* Connection floater */}
                <div className="float-3 absolute -bottom-4 -right-4 lg:-right-10 hero-card rounded-2xl px-4 py-3 shadow-xl shadow-blue-50 z-20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div>
                      <div className="font-display text-sm font-700 text-slate-900">New Connection</div>
                      <div className="text-xs text-green-500 font-semibold">+10 pts earned ✓</div>
                    </div>
                  </div>
                </div>

                {/* Tier floater */}
                <div className="float-2 absolute top-1/2 -right-6 lg:-right-16 hero-card rounded-2xl px-3.5 py-2.5 shadow-lg z-20 hidden lg:flex items-center gap-2" style={{animationDelay:'2s'}}>
                  <span className="text-base">🏆</span>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Connector Tier</div>
                    <div className="text-xs text-slate-400">340 / 600 pts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(59,130,246,0.07) 1px, transparent 0)', backgroundSize:'32px 32px'}}/>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div ref={featRef} className="text-center mb-16">
            <div className={`fade-up ${featIn ? "visible" : ""}`}>
              <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full border border-blue-100 mb-4">Platform Features</span>
            </div>
            <h2 className={`font-display text-4xl lg:text-5xl font-700 text-slate-900 tracking-tight mb-4 fade-up d1 ${featIn ? "visible" : ""}`}>
              Everything You Need —<br/><span className="text-blue-600">And Points for Using It</span>
            </h2>
            <p className={`text-slate-500 text-lg max-w-xl mx-auto fade-up d2 ${featIn ? "visible" : ""}`}>
              Every feature on BizCircle is designed to help you grow — and reward you for engaging with the community.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`feature-card bg-white rounded-2xl p-6 shadow-sm border border-slate-100 cursor-pointer fade-up d${i+1} ${featIn ? "visible" : ""}`}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.accent} flex items-center justify-center text-white mb-5 shadow-md`} style={{boxShadow:`0 6px 20px rgba(59,130,246,0.22)`}}>
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-700 text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{f.desc}</p>
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5 w-fit">
                  <svg className="w-3 h-3 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span className="text-xs font-semibold text-amber-600">{f.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="about" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={howRef} className="text-center mb-16">
            <div className={`fade-up ${howIn ? "visible" : ""}`}>
              <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full border border-blue-100 mb-4">How It Works</span>
            </div>
            <h2 className={`font-display text-4xl lg:text-5xl font-700 text-slate-900 tracking-tight mb-4 fade-up d1 ${howIn ? "visible" : ""}`}>
              Three Steps to Grow —<br/><span className="text-blue-600">Points at Every Stage</span>
            </h2>
            <p className={`text-slate-500 text-lg max-w-lg mx-auto fade-up d2 ${howIn ? "visible" : ""}`}>
              Getting started is simple. And every action you take moves you up the BizPoints ladder.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 z-0"/>
            {STEPS.map((s, i) => (
              <div key={s.num} className={`relative z-10 text-center fade-up d${i+1} ${howIn ? "visible" : ""}`}>
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center shadow-xl shadow-blue-200 mx-auto">
                    <div className="text-white">{s.icon}</div>
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-blue-200 text-blue-700 text-xs font-bold font-display flex items-center justify-center">{i+1}</span>
                </div>
                <div className="font-display text-5xl font-800 text-blue-50 mb-2 select-none">{s.num}</div>
                <h3 className="font-display text-xl font-700 text-slate-900 mb-2 -mt-6">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto mb-4">{s.desc}</p>
                <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                  <svg className="w-3 h-3 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span className="text-xs font-bold text-amber-600">{s.reward}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EARN POINTS BAND */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-700 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize:'28px 28px'}}/>
        <div ref={earnRef} className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="text-center mb-10">
            <h2 className={`font-display text-3xl lg:text-4xl font-700 text-white mb-2 fade-up ${earnIn ? "visible" : ""}`}>Ways to Earn BizPoints</h2>
            <p className={`text-blue-200 fade-up d1 ${earnIn ? "visible" : ""}`}>Every interaction on the platform has a reward attached to it.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {EARN_ACTIONS.map((a, i) => (
              <div key={a.action} className={`earn-tile bg-white/10 border border-white/15 rounded-2xl p-4 text-center fade-up d${i+1} ${earnIn ? "visible" : ""}`}>
                <div className="text-2xl mb-2">{a.icon}</div>
                <div className="text-white text-xs font-medium leading-tight mb-2">{a.action}</div>
                <div className="font-display text-sm font-700 text-amber-300">{a.points}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 opacity-50 blob" style={{filter:'blur(80px)'}}/>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50 opacity-70 blob" style={{filter:'blur(60px)', animationDelay:'3s'}}/>
        <div ref={ctaRef} className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className={`fade-up ${ctaIn ? "visible" : ""}`}>
            <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full border border-blue-100 mb-6">Get Started Today</span>
          </div>
          <h2 className={`font-display text-4xl lg:text-6xl font-800 text-slate-900 tracking-tight mb-6 fade-up d1 ${ctaIn ? "visible" : ""}`}>
            Start Building.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">Start Earning.</span>
          </h2>
          <p className={`text-slate-500 text-lg max-w-xl mx-auto mb-4 fade-up d2 ${ctaIn ? "visible" : ""}`}>
            Join BizCircle for free, build your professional circle, and earn BizPoints with every connection and collaboration.
          </p>
          <p className={`text-amber-600 font-semibold text-sm mb-10 fade-up d2 ${ctaIn ? "visible" : ""}`}>
            🎁 Sign up now and get 50 BizPoints just for completing your profile.
          </p>
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 fade-up d3 ${ctaIn ? "visible" : ""}`}>
            <a href="/signup" className="btn-primary text-white font-semibold text-base px-8 py-4 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2">
              Create Free Account
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#features" className="bg-slate-50 text-slate-700 font-semibold text-base px-8 py-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 w-full sm:w-auto text-center">
              Explore Features
            </a>
          </div>
          <p className={`text-slate-400 text-sm mt-5 fade-up d4 ${ctaIn ? "visible" : ""}`}>No credit card required · Free to join · Start earning points immediately</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
                  <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                    <circle cx="5" cy="10" r="2.5"/><circle cx="15" cy="5" r="2.5"/><circle cx="15" cy="15" r="2.5"/>
                    <line x1="7.2" y1="9" x2="13" y2="6.2" stroke="white" strokeWidth="1.5"/>
                    <line x1="7.2" y1="11" x2="13" y2="13.8" stroke="white" strokeWidth="1.5"/>
                  </svg>
                </div>
                <span className="font-display text-xl font-700 text-white">BizCircle</span>
              </div>
              <p className="text-sm leading-relaxed mb-5">Connect, collaborate, and grow — while earning rewards along the way.</p>
              <div className="flex items-center gap-3">
                {[
                  <path key="tw" d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>,
                  <><rect key="ig-r" x="2" y="2" width="20" height="20" rx="5" ry="5"/><path key="ig-p" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line key="ig-l" x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>,
                  <path key="li" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>,
                ].map((p, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors duration-200">
                    <svg className="w-4 h-4 text-slate-400 hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{p}</svg>
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: "Platform", links: ["Features", "How It Works", "BizPoints Rewards", "Early Access"] },
              { title: "Company", links: ["About", "Our Team", "Contact Us"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-sm hover:text-white transition-colors duration-200">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm">© 2025 BizCircle. All rights reserved.</p>
            <p className="text-sm">Network better. Earn more. Grow together.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}