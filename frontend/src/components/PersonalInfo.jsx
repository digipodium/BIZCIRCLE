"use client";

import { User, Mail, Phone, Calendar, MapPin, Globe, Shield } from "lucide-react";

const fields = [
  { label: "Full Name", value: "Arjun Kapoor", icon: User },
  { label: "Email Address", value: "arjun.kapoor@email.com", icon: Mail },
  { label: "Phone Number", value: "+91 98765 43210", icon: Phone },
  { label: "Date of Birth", value: "15 March 2002", icon: Calendar },
  { label: "Current Location", value: "New Delhi, Delhi, India", icon: MapPin },
  { label: "Website", value: "arjunkapoor.dev", icon: Globe },
];

export default function PersonalInfo() {
  return (
    <div className="space-y-4 animate-fadeInTab">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Personal Information</h2>
          <button className="text-xs text-blue-600 font-semibold hover:underline">Edit</button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="group flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-lg bg-white group-hover:bg-blue-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 flex-shrink-0 transition-colors border border-slate-100 group-hover:border-blue-200">
                <Icon size={15} />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">{label}</p>
                <p className="text-sm text-slate-700 font-medium mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4 flex items-start gap-3">
        <Shield size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-700">Privacy Protected</p>
          <p className="text-xs text-blue-500 mt-0.5 leading-relaxed">
            Your personal information is only visible to your circle members and accepted connections. 
            You can control visibility in Settings.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInTab {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInTab { animation: fadeInTab 0.35s ease-out both; }
      `}</style>
    </div>
  );
}
