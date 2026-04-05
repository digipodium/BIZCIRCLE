"use client";
import { useState } from "react";

export default function DomainsInterests() {
  const DomainsInterests = () => {
  const primaryOpts   = ["Web Development","Data Science","Product Management","Digital Marketing","UI/UX Design","Finance & Investing","Business Strategy","AI / ML","DevOps","Content Creation"];
  const secondaryOpts = ["Startups","Venture Capital","Growth Hacking","No-Code","Remote Work","Leadership","Sales","Community Building","Sustainability","EdTech"];
  const networkOpts   = ["Mentorship","Co-founding","Hiring","Collaborating","Investor Connect","Knowledge Sharing","Freelance Projects","Partnerships"];
  const topicOpts     = ["Future of Work","Web3","SaaS Trends","Product-Led Growth","Mental Health at Work","DEI","Climate Tech","Creator Economy","Open Source","Machine Learning"];
 
  const [primary,    setPrimary]    = useState(["Product Management","Business Strategy"]);
  const [secondary,  setSecondary]  = useState(["Startups","Growth Hacking","Leadership"]);
  const [networking, setNetworking] = useState(["Mentorship","Knowledge Sharing"]);
  const [topics,     setTopics]     = useState(["Future of Work","SaaS Trends","Product-Led Growth"]);
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };
  const allSelected = [...primary, ...secondary, ...networking, ...topics];
 
  return (
    <Section title="Domain & Interests" icon={Target} delay="0.1s">
      <div style={{ marginBottom: 20 }}>
        <div className="section-eyebrow" style={{ marginBottom: 4 }}>Primary Domain</div>
        <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: 12 }}>Your main professional focus area</p>
        <ChipGroup options={primaryOpts} selected={primary} setSelected={setPrimary} />
      </div>
      <hr className="divider" />
      <div style={{ marginBottom: 20 }}>
        <div className="section-eyebrow" style={{ marginBottom: 4 }}>Secondary Interests</div>
        <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: 12 }}>Other areas you're curious about</p>
        <ChipGroup options={secondaryOpts} selected={secondary} setSelected={setSecondary} />
      </div>
      <hr className="divider" />
      <div style={{ marginBottom: 20 }}>
        <div className="section-eyebrow" style={{ marginBottom: 4 }}>Preferred Networking</div>
        <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: 12 }}>What kind of connections are you looking for?</p>
        <ChipGroup options={networkOpts} selected={networking} setSelected={setNetworking} />
      </div>
      <hr className="divider" />
      <div style={{ marginBottom: 20 }}>
        <div className="section-eyebrow" style={{ marginBottom: 4 }}>Topics of Interest</div>
        <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: 12 }}>Content and conversations you want to engage with</p>
        <ChipGroup options={topicOpts} selected={topics} setSelected={setTopics} />
      </div>
      {allSelected.length > 0 && (
        <div style={{ padding: 16, borderRadius: 12, marginBottom: 20, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#2563eb", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Your selected tags ({allSelected.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {allSelected.map(t => (
              <span key={t} style={{ fontSize: "0.75rem", padding: "3px 10px", borderRadius: 6, background: "#dbeafe", border: "1px solid #bfdbfe", color: "#2563eb", fontFamily: "'Inter',sans-serif" }}>{t}</span>
            ))}
          </div>
        </div>
      )}
      <SaveBar onSave={save} saved={saved} />
    </Section>
  );
};
}