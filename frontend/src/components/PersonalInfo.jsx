"use client";

import { User, Mail, Phone, Calendar, MapPin } from "lucide-react";
import { useState } from "react";

export default function PersonalInfo() {

  const [form, setForm] = useState({
    fullName: "Rahul Mehta",
    email: "rahul.mehta@example.com",
    phone: "+91 98765 43210",
    dob: "1992-06-15",
    gender: "Male",
    location: "Mumbai, India",
  });

  const [saved, setSaved] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto shadow-lg rounded-xl">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <User /> Personal Information
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="block mb-1">Full Name</label>
          <input className="inp w-full" value={form.fullName}
            onChange={e => set("fullName", e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 flex items-center gap-1">
            <Mail size={16} /> Email
          </label>
          <input className="inp w-full" type="email"
            value={form.email}
            onChange={e => set("email", e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 flex items-center gap-1">
            <Phone size={16} /> Phone
          </label>
          <input className="inp w-full"
            value={form.phone}
            onChange={e => set("phone", e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 flex items-center gap-1">
            <Calendar size={16} /> DOB
          </label>
          <input className="inp w-full" type="date"
            value={form.dob}
            onChange={e => set("dob", e.target.value)} />
        </div>

        <div>
          <label className="block mb-1">Gender</label>
          <select className="inp w-full"
            value={form.gender}
            onChange={e => set("gender", e.target.value)}>
            {["Male", "Female", "Non-binary", "Prefer not to say"].map(g => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 flex items-center gap-1">
            <MapPin size={16} /> Location
          </label>
          <input className="inp w-full"
            value={form.location}
            onChange={e => set("location", e.target.value)} />
        </div>

      </div>

      <button
        onClick={save}
        className="mt-4 w-full bg-black text-white py-2 rounded-lg"
      >
        Save
      </button>

      {saved && <p className="text-green-600 mt-2">Saved successfully!</p>}
    </div>
  );
}