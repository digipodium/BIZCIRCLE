"use client";
import { 
  User, Mail, Phone, Calendar, MapPin 
} from "lucide-react";
import { useState } from "react";

export default function PersonalInfo() {

  const [form, setForm] = useState({
    fullName: "Rahul Mehta", email: "rahul.mehta@example.com",
    phone: "+91 98765 43210", dob: "1992-06-15",
    gender: "Male", location: "Mumbai, India",
  });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };

  return (
    <Section title="Personal Information" icon={User} delay="0.05s">
      <div className="form-grid">
        <div><FieldLabel icon={User}>Full Name</FieldLabel>
          <input className="inp" value={form.fullName} onChange={e => set("fullName", e.target.value)} /></div>
        <div><FieldLabel icon={Mail}>Email Address</FieldLabel>
          <input className="inp" type="email" value={form.email} onChange={e => set("email", e.target.value)} /></div>
        <div><FieldLabel icon={Phone}>Phone <span style={{ color: "#94a3b8" }}>(optional)</span></FieldLabel>
          <input className="inp" value={form.phone} onChange={e => set("phone", e.target.value)} /></div>
        <div><FieldLabel icon={Calendar}>Date of Birth <span style={{ color: "#94a3b8" }}>(optional)</span></FieldLabel>
          <input className="inp" type="date" value={form.dob} onChange={e => set("dob", e.target.value)} /></div>
        <div><FieldLabel icon={User}>Gender <span style={{ color: "#94a3b8" }}>(optional)</span></FieldLabel>
          <select className="inp" value={form.gender} onChange={e => set("gender", e.target.value)}>
            {["Male", "Female", "Non-binary", "Prefer not to say"].map(g => <option key={g}>{g}</option>)}
          </select></div>
        <div><FieldLabel icon={MapPin}>Location</FieldLabel>
          <input className="inp" value={form.location} onChange={e => set("location", e.target.value)} /></div>
      </div>
      <hr className="divider" />
      <SaveBar onSave={save} saved={saved} />
    </Section>
  );
};