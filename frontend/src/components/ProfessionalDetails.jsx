"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Briefcase, Code2, GraduationCap, ExternalLink, Layers } from "lucide-react";
const experience = [
  {
    role: "Frontend Intern",
    company: "Growthify Pvt. Ltd.",
    period: "Jun 2024 – Present",
    type: "Hybrid · New Delhi",
    desc: "Built reusable React components and optimized Next.js pages for performance. Collaborated with design team on UI/UX improvements, reducing load times by 40%.",
    color: "blue",
  },
  {
    role: "Web Dev Freelancer",
    company: "Self-employed",
    period: "Jan 2023 – May 2024",
    type: "Remote",
    desc: "Delivered 8+ client websites using React and WordPress. Handled full project lifecycle from design to deployment.",
    color: "indigo",
  },
  {
    role: "Tech Lead",
    company: "NSIT Developer Club",
    period: "Aug 2022 – Dec 2023",
    type: "On-site · Delhi",
    desc: "Led a team of 12 developers to build the college's event management portal. Organized 4 hackathons with 300+ participants.",
    color: "violet",
  },
];

const projects = [
  { name: "BizCircle", desc: "Professional networking platform with domain-based communities. Final year project.", stack: "Next.js · Tailwind · MongoDB", link: "#" },
  { name: "ShopVista", desc: "Full-stack e-commerce app with real-time inventory and Stripe payments.", stack: "React · Node.js · PostgreSQL", link: "#" },
];

const skills = ["React.js", "Next.js", "TypeScript", "Node.js", "MongoDB", "PostgreSQL", "Tailwind CSS", "REST APIs", "Git", "Docker"];

const colorDot = { blue: "bg-blue-500", indigo: "bg-indigo-500", violet: "bg-violet-500" };
const colorLine = { blue: "border-blue-200", indigo: "border-indigo-200", violet: "border-violet-200" };

export default function ProfessionalDetails() {
  return (
    <div className="space-y-4 animate-fadeInTab">
      {/* Role & Org */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Current Role</h2>
        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">G</div>
          <div>
            <p className="font-bold text-slate-800">Frontend Intern</p>
            <p className="text-sm text-slate-500">Growthify Pvt. Ltd.</p>
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full mt-1 inline-block">Current</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Code2 size={15} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Tech Skills</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-150 hover:scale-105 cursor-default">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Experience Timeline */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-5">
          <Briefcase size={15} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Experience</h2>
        </div>
        <div className="relative pl-6 space-y-6">
          {/* Timeline line */}
          <div className="absolute left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-300 via-indigo-200 to-violet-200" />

          {experience.map((exp, i) => (
            <div key={i} className="relative group">
              {/* Dot */}
              <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full ${colorDot[exp.color]} border-2 border-white shadow-sm group-hover:scale-110 transition-transform`} />
              <div className={`bg-slate-50 group-hover:bg-blue-50/50 rounded-xl p-4 border border-transparent group-hover:border-blue-100 transition-all duration-200`}>
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{exp.role}</p>
                    <p className="text-sm text-slate-500">{exp.company}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-full">{exp.period}</span>
                    <p className="text-xs text-slate-400 mt-1">{exp.type}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{exp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Layers size={15} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Projects</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {projects.map((p) => (
            <div key={p.name} className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl p-4 border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200 hover:scale-[1.01] group">
              <div className="flex items-start justify-between">
                <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                <a href={p.link} className="text-slate-300 hover:text-blue-500 transition-colors">
                  <ExternalLink size={13} />
                </a>
              </div>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{p.desc}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {p.stack.split(" · ").map((t) => (
                  <span key={t} className="text-[10px] font-medium bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Professional Links</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "Github", url: "github.com/arjunkapoor", icon: FaGithub, color: "hover:border-slate-400 hover:text-slate-800" },
            { label: "LinkedIn", url: "linkedin.com/in/arjunkapoor", icon: FaLinkedin, color: "hover:border-blue-400 hover:text-blue-700" },
          ].map(({ label, url, icon: Icon, color }) => (
            <a
              key={label}
              href="#"
              className={`flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 ${color} transition-all duration-200 group`}
            >
              <Icon size={18} className="text-slate-400 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs text-slate-400 font-medium">{label}</p>
                <p className="text-sm text-slate-600 font-medium">{url}</p>
              </div>
              <ExternalLink size={12} className="ml-auto text-slate-300" />
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInTab { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInTab { animation: fadeInTab 0.35s ease-out both; }
      `}</style>
    </div>
  );
}