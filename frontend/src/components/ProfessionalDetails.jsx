"use client";

import { useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Briefcase, Code2, ExternalLink, Layers, Check, Loader2, Plus, X } from "lucide-react";
import { useProfile } from "@/lib/useProfile";

const colorDot = { 0: "bg-blue-500", 1: "bg-indigo-500", 2: "bg-violet-500" };

export default function ProfessionalDetails() {
  const { user, loading, updateProfile } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [form, setForm] = useState(null);

  const skills = user?.skills || [];
  const experience = user?.experience || [];
  const projects = user?.projects || [];

  const startEdit = () => {
    setForm({
      skills: (user?.skills || []).join(", "),
      github: user?.github || "",
      linkedin: user?.linkedin || "",
      organization: user?.organization || "",
      role: user?.role || "",
      headline: user?.headline || "",
      experience: user?.experience ? [...user.experience] : [],
      projects: user?.projects ? [...user.projects] : [],
    });
    setEditMode(true);
    setSaveMsg("");
  };

  const addField = (field) => setForm((f) => ({ ...f, [field]: [...f[field], {}] }));
  const removeField = (field, idx) => setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));
  const updateField = (field, idx, key, val) =>
    setForm((f) => ({
      ...f,
      [field]: f[field].map((item, i) => (i === idx ? { ...item, [key]: val } : item)),
    }));

  const cancelEdit = () => {
    setEditMode(false);
    setForm(null);
    setSaveMsg("");
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = {
      ...form,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const result = await updateProfile(updates);
    setSaving(false);
    if (result.success) {
      setSaveMsg("Saved!");
      setEditMode(false);
      setForm(null);
      setTimeout(() => setSaveMsg(""), 3000);
    } else {
      setSaveMsg(result.message || "Save failed");
    }
  };

  return (
    <div className="space-y-4 animate-fadeInTab">
      {/* Quick edit toolbar */}
      <div className="flex items-center justify-end gap-2">
        {saveMsg && (
          <span className={`text-xs font-semibold ${saveMsg === "Saved!" ? "text-emerald-600" : "text-red-500"}`}>
            {saveMsg}
          </span>
        )}
        {editMode ? (
          <>
            <button onClick={cancelEdit} className="text-xs text-slate-500 font-semibold hover:underline">Cancel</button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              {saving ? "Saving..." : "Save"}
            </button>
          </>
        ) : (
          <button onClick={startEdit} className="text-xs text-blue-600 font-semibold hover:underline">
            Edit Details
          </button>
        )}
      </div>

      {/* Role & Org */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Current Role</h2>
        {editMode ? (
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Role / Title</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                placeholder="e.g. Frontend Intern"
                className="mt-1 w-full text-sm text-slate-800 bg-slate-50 border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Organization</label>
              <input
                type="text"
                value={form.organization}
                onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
                placeholder="e.g. Growthify Pvt. Ltd."
                className="mt-1 w-full text-sm text-slate-800 bg-slate-50 border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Headline</label>
              <input
                type="text"
                value={form.headline}
                onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
                placeholder="e.g. Full Stack Developer · Final Year"
                className="mt-1 w-full text-sm text-slate-800 bg-slate-50 border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        ) : loading ? (
          <div className="h-16 bg-slate-100 rounded-xl animate-pulse" />
        ) : (
          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.organization?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-bold text-slate-800">{user?.role || <span className="text-slate-400 italic">No role set</span>}</p>
              <p className="text-sm text-slate-500">{user?.organization || <span className="text-slate-400 italic">No organization set</span>}</p>
              {user?.headline && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full mt-1 inline-block">{user.headline}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Code2 size={15} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Tech Skills</h2>
        </div>
        {editMode ? (
          <div>
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              value={form.skills}
              onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
              placeholder="React.js, Node.js, TypeScript..."
              className="mt-1 w-full text-sm text-slate-800 bg-slate-50 border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ) : loading ? (
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-7 w-20 bg-slate-100 rounded-full animate-pulse" />
            ))}
          </div>
        ) : skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s} className="bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-150 hover:scale-105 cursor-default">
                {s}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic text-sm">No skills added. Click &quot;Edit Details&quot; to add some.</p>
        )}
      </div>

      {/* Experience Timeline */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-5">
          <Briefcase size={15} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Experience</h2>
        </div>
        {editMode ? (
          <div className="space-y-4">
            {form.experience.map((exp, i) => (
              <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                <button type="button" onClick={() => removeField('experience', i)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors"><X size={15}/></button>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Role</label>
                    <input type="text" value={exp.role || ''} onChange={e => updateField('experience', i, 'role', e.target.value)} className="mt-1 w-full text-sm text-slate-800 bg-white border border-blue-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Company</label>
                    <input type="text" value={exp.company || ''} onChange={e => updateField('experience', i, 'company', e.target.value)} className="mt-1 w-full text-sm text-slate-800 bg-white border border-blue-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Period & Type</label>
                    <div className="flex gap-2">
                       <input type="text" placeholder="e.g. 2021 - 2023" value={exp.period || ''} onChange={e => updateField('experience', i, 'period', e.target.value)} className="mt-1 w-1/2 text-sm text-slate-800 bg-white border border-blue-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                       <input type="text" placeholder="e.g. Full-time" value={exp.type || ''} onChange={e => updateField('experience', i, 'type', e.target.value)} className="mt-1 w-1/2 text-sm text-slate-800 bg-white border border-blue-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Description</label>
                    <textarea value={exp.desc || ''} onChange={e => updateField('experience', i, 'desc', e.target.value)} className="mt-1 w-full text-sm text-slate-800 bg-white border border-blue-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400" rows={2}/>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addField('experience')} className="text-xs flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-200 font-semibold hover:bg-blue-100 transition-colors"><Plus size={14}/> Add Experience</button>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : experience.length > 0 ? (
          <div className="relative pl-6 space-y-6">
            <div className="absolute left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-300 via-indigo-200 to-violet-200" />
            {experience.map((exp, i) => (
              <div key={i} className="relative group">
                <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full ${colorDot[i % 3]} border-2 border-white shadow-sm group-hover:scale-110 transition-transform`} />
                <div className="bg-slate-50 group-hover:bg-blue-50/50 rounded-xl p-4 border border-transparent group-hover:border-blue-100 transition-all duration-200">
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
                  {exp.desc && <p className="text-xs text-slate-600 mt-2 leading-relaxed">{exp.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic text-sm text-center py-4">No experience entries yet.</p>
        )}
      </div>

      {/* Projects */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Layers size={15} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Projects</h2>
        </div>
        {editMode ? (
          <div className="space-y-4">
            {form.projects.map((proj, i) => (
              <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                <button type="button" onClick={() => removeField('projects', i)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors"><X size={15}/></button>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Project Name</label>
                    <input type="text" value={proj.name || ''} onChange={e => updateField('projects', i, 'name', e.target.value)} className="mt-1 w-full text-sm text-slate-800 bg-white border border-blue-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Link</label>
                    <input type="text" placeholder="https://..." value={proj.link || ''} onChange={e => updateField('projects', i, 'link', e.target.value)} className="mt-1 w-full text-sm text-slate-800 bg-white border border-blue-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tech Stack (comma or · separated)</label>
                    <input type="text" placeholder="React · Node · MongoDB" value={proj.stack || ''} onChange={e => updateField('projects', i, 'stack', e.target.value)} className="mt-1 w-full text-sm text-slate-800 bg-white border border-blue-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Description</label>
                    <textarea value={proj.desc || ''} onChange={e => updateField('projects', i, 'desc', e.target.value)} className="mt-1 w-full text-sm text-slate-800 bg-white border border-blue-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400" rows={2}/>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addField('projects')} className="text-xs flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-200 font-semibold hover:bg-blue-100 transition-colors"><Plus size={14}/> Add Project</button>
          </div>
        ) : loading ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {projects.map((p, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl p-4 border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200 hover:scale-[1.01] group">
                <div className="flex items-start justify-between">
                  <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                  {p.link && p.link !== "#" && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-blue-500 transition-colors">
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{p.desc}</p>
                {p.stack && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {p.stack.split(" · ").map((t) => (
                      <span key={t} className="text-[10px] font-medium bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic text-sm text-center py-4">No projects added yet.</p>
        )}
      </div>

      {/* Professional Links */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Professional Links</h2>
        {editMode ? (
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">GitHub</label>
              <input
                type="text"
                value={form.github}
                onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
                placeholder="github.com/username"
                className="mt-1 w-full text-sm text-slate-800 bg-slate-50 border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">LinkedIn</label>
              <input
                type="text"
                value={form.linkedin}
                onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
                placeholder="linkedin.com/in/username"
                className="mt-1 w-full text-sm text-slate-800 bg-slate-50 border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: "Github", url: user?.github, icon: FaGithub, color: "hover:border-slate-400 hover:text-slate-800" },
              { label: "LinkedIn", url: user?.linkedin, icon: FaLinkedin, color: "hover:border-blue-400 hover:text-blue-700" },
            ].map(({ label, url, icon: Icon, color }) => (
              <a
                key={label}
                href={url ? `https://${url}` : "#"}
                target={url ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 ${color} transition-all duration-200 group`}
              >
                <Icon size={18} className="text-slate-400 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-xs text-slate-400 font-medium">{label}</p>
                  <p className="text-sm text-slate-600 font-medium">
                    {url || <span className="text-slate-400 italic">Not set</span>}
                  </p>
                </div>
                <ExternalLink size={12} className="ml-auto text-slate-300" />
              </a>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInTab { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInTab { animation: fadeInTab 0.35s ease-out both; }
      `}</style>
    </div>
  );
}