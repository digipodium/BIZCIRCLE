"use client";
import { useState } from "react";

export default function ProfessionalDetails() {

const ProfessionalDetails = () => {
  const [skills, setSkills] = useState(["Product Strategy","B2B SaaS","GTM","OKRs","Agile","Fundraising","User Research"]);
  const [industry, setIndustry] = useState(["Technology","FinTech"]);
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };
  const industries = ["Technology","Marketing","Finance","Healthcare","EdTech","FinTech","E-Commerce","Consulting"];

  return (
    <Section title="Professional Details" icon={Briefcase} delay="0.08s" accent>
      <div className="form-grid">
        <div><FieldLabel icon={Award}>Role / Designation</FieldLabel>
          <input className="inp" defaultValue="Senior Product Strategist" /></div>
        <div><FieldLabel icon={Building2}>Company / Organisation</FieldLabel>
          <input className="inp" defaultValue="GrowthLabs Pvt. Ltd." /></div>
        <div><FieldLabel icon={Clock}>Years of Experience</FieldLabel>
          <select className="inp" defaultValue="8–10">
            {["0–1","1–3","3–5","5–8","8–10","10–15","15+"].map(y => <option key={y}>{y} years</option>)}
          </select></div>
        <div><FieldLabel icon={Briefcase}>Employment Type</FieldLabel>
          <select className="inp" defaultValue="Full-time">
            {["Full-time","Part-time","Freelance","Consultant","Founder"].map(t => <option key={t}>{t}</option>)}
          </select></div>
      </div>
      <hr className="divider" />
      <div style={{ marginBottom: 20 }}>
        <div className="section-eyebrow" style={{ marginBottom: 4 }}>Industry / Domain</div>
        <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: 12 }}>Select all that apply</p>
        <ChipGroup options={industries} selected={industry} setSelected={setIndustry} />
      </div>
      <hr className="divider" />
      <div style={{ marginBottom: 20 }}>
        <div className="section-eyebrow" style={{ marginBottom: 4 }}>Skills</div>
        <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: 12 }}>Add your professional skills</p>
        <SkillInput skills={skills} setSkills={setSkills} />
      </div>
      <hr className="divider" />
      <div style={{ marginBottom: 20 }}>
        <div className="section-eyebrow" style={{ marginBottom: 12 }}>Online Presence</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="link-row"><Linkedin size={16} color="#2563eb" />
            <input placeholder="linkedin.com/in/your-profile" defaultValue="linkedin.com/in/rahulmehta" /></div>
          <div className="link-row"><Globe size={16} color="#0ea5e9" />
            <input placeholder="yourportfolio.com" defaultValue="rahulmehta.com" /></div>
          <div className="link-row"><Link size={16} color="#94a3b8" />
            <input placeholder="Other link (GitHub, Dribbble…)" /></div>
        </div>
      </div>
      <hr className="divider" />
      <SaveBar onSave={save} saved={saved} />
    </Section>
  );
};
}