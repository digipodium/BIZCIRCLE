"use client";

import { useState } from "react";
import Link from "next/link";

const CheckIcon = () => (
  <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const plans = [
  {
    name: "Free",
    badge: null,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect to get started and explore BizCircle.",
    cta: "Get Started",
    ctaHref: "/signup",
    highlight: false,
    color: "from-slate-50 to-white",
    border: "border-slate-200",
    btnClass: "bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    features: [
      "Create your public profile",
      "Browse opportunities & projects",
      "Up to 10 connections/month",
      "Join basic networking groups",
      "Access community feed",
    ],
  },
  {
    name: "Starter",
    monthlyPrice: 99,
    yearlyPrice: 79,
    description: "Unlock the full power of BizCircle for students & startups.",
    cta: "Upgrade Now",
    ctaHref: "/signup?plan=student",
    highlight: true,
    color: "from-blue-600 to-indigo-700",
    border: "border-blue-500",
    btnClass: "bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-lg",
    features: [
      "Unlimited connections",
      "Access premium projects & collabs",
      "Profile highlighted in search",
      "Priority in referrals",
      "Earn 2× BizPoints on all actions",
      "Collaboration badges & portfolio",
    ],
  },
  {
    name: "Professional",
    badge: null,
    monthlyPrice: 199,
    yearlyPrice: 159,
    description: "For founders, recruiters, and growth-focused pros.",
    cta: "Go Pro",
    ctaHref: "/signup?plan=pro",
    highlight: false,
    color: "from-slate-50 to-white",
    border: "border-slate-200",
    btnClass: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md",
    features: [
      "Everything in Starter Plan",
      "Advanced filters (industry, stage)",
      "Featured profile listing",
      "Direct message recruiters & founders",
      "Analytics dashboard",
      "Dedicated support",
    ],
  },
];

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes — cancel anytime with no questions asked. You keep access until the end of your billing period." },
  { q: "Is there a student discount?", a: "The Student Premium plan is already priced with students in mind. Yearly billing saves you an extra 20%." },
  { q: "What happens to my BizPoints if I downgrade?", a: "Your BizPoints never expire. You keep every point you've earned, regardless of your plan." },
  { q: "Do you offer refunds?", a: "We offer a full refund within 7 days of your first payment, no hassle." },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600 tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
          Biz<span className="text-slate-800">Circle</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-600 hover:text-blue-600 transition-colors px-3 py-1.5">Log in</Link>
          <Link href="/signup" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Sign up free
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-28 pb-16 px-6 text-center relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 blur-3xl opacity-40 pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-widest uppercase border border-blue-100">
            Pricing
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
            Simple, Student-Friendly<br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Pricing</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto mb-8">
            Start for free, upgrade as you grow. No hidden fees, no surprises.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-slate-100 rounded-full p-1 border border-slate-200">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!yearly ? "bg-white shadow text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${yearly ? "bg-white shadow text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
            >
              Yearly
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Pricing Cards ── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border ${plan.border} overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                plan.highlight
                  ? "shadow-2xl shadow-blue-200 scale-[1.02] md:scale-105"
                  : "shadow-md"
              }`}
            >
              {/* Card top gradient */}
              <div className={`bg-gradient-to-br ${plan.color} p-7 flex-1 flex flex-col`}>
                {plan.badge && (
                  <span className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                    {plan.badge}
                  </span>
                )}

                <p className={`text-sm font-semibold mb-1 ${plan.highlight ? "text-blue-100" : "text-blue-500"}`}>
                  {plan.name}
                </p>
                <p className={`text-4xl font-extrabold mb-1 ${plan.highlight ? "text-white" : "text-slate-900"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                  {plan.monthlyPrice === 0 ? "₹0" : `₹${yearly ? plan.yearlyPrice : plan.monthlyPrice}`}
                  <span className={`text-base font-normal ml-1 ${plan.highlight ? "text-blue-200" : "text-slate-400"}`}>/mo</span>
                </p>
                {yearly && plan.monthlyPrice > 0 && (
                  <p className={`text-xs mb-2 ${plan.highlight ? "text-blue-200" : "text-slate-400"}`}>
                    Billed ₹{plan.yearlyPrice * 12}/year
                  </p>
                )}
                <p className={`text-sm mb-6 ${plan.highlight ? "text-blue-100" : "text-slate-500"}`}>
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="space-y-2.5 mb-7 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      {plan.highlight ? (
                        <svg className="w-4 h-4 text-white flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <CheckIcon />
                      )}
                      <span className={`text-sm leading-snug ${plan.highlight ? "text-white" : "text-slate-600"}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-all duration-200 hover:scale-[1.02] active:scale-95 ${plan.btnClass}`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Free Trial Banner ── */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-center overflow-hidden shadow-xl shadow-blue-200">
          {/* Decorative circles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10">
            <span className="inline-block mb-3 px-4 py-1 rounded-full bg-white/20 text-white text-xs font-bold tracking-widest uppercase">
              Limited Offer
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
              Try Premium Free for 7 Days
            </h2>
            <p className="text-blue-100 mb-7 max-w-md mx-auto">
              No credit card required. Get full access to Student Premium and experience the difference.
            </p>
            <Link
              href="/signup?trial=true"
              className="inline-block bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-all hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Start Free Trial →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature Comparison ── */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8" style={{ fontFamily: "'Syne', sans-serif" }}>
          Compare Plans
        </h2>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-4 text-slate-500 font-semibold w-1/2">Feature</th>
                <th className="text-center px-4 py-4 text-slate-700 font-semibold">Free</th>
                <th className="text-center px-4 py-4 text-blue-600 font-bold">Starter</th>
                <th className="text-center px-4 py-4 text-slate-700 font-semibold">Pro</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Profile creation", true, true, true],
                ["Browse opportunities", true, true, true],
                ["Monthly connections", "10", "Unlimited", "Unlimited"],
                ["Premium projects", false, true, true],
                ["Highlighted in search", false, true, true],
                ["Advanced filters", false, false, true],
                ["Direct message recruiters", false, false, true],
                ["Analytics dashboard", false, false, true],
                ["BizPoints multiplier", "1×", "2×", "3×"],
              ].map(([feature, free, starter, pro], i) => (
                <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{feature}</td>
                  {[free, starter, pro].map((val, j) => (
                    <td key={j} className="text-center px-4 py-3.5">
                      {typeof val === "boolean" ? (
                        val ? (
                          <span className="inline-flex justify-center">
                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        ) : (
                          <span className="text-slate-300 font-bold">—</span>
                        )
                      ) : (
                        <span className={`font-semibold ${j === 1 ? "text-blue-600" : "text-slate-700"}`}>{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8" style={{ fontFamily: "'Syne', sans-serif" }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-5 py-4 text-left flex items-center justify-between text-slate-800 font-medium hover:bg-slate-50 transition-colors"
              >
                {faq.q}
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-slate-500 text-sm leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} BizCircle. All rights reserved.
        <span className="mx-2">·</span>
        <Link href="/login" className="hover:text-blue-500 transition-colors">Login</Link>
        <span className="mx-2">·</span>
        <Link href="/signup" className="hover:text-blue-500 transition-colors">Sign up</Link>
      </footer>
    </div>
  );
}