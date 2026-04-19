"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import api from "@/lib/axios";
import {
  Search, Users, User, X, ArrowRight, UserPlus, Loader2
} from "lucide-react";
import Link from "next/link";
import { useProfile } from "@/lib/useProfile";

// ─── Highlight matching text ─────────────────────────────────────────────────
function Highlight({ text = "", query = "" }) {
  if (!query.trim() || !text) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-blue-100 text-blue-700 rounded px-0.5 not-italic font-semibold">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

// ─── User Card ───────────────────────────────────────────────────────────────
function UserCard({ user, query, onConnect }) {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await onConnect(user._id);
      setConnected(true);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 flex flex-col gap-4">
      <Link href={`/user/${user._id}`} className="flex items-start gap-4 group cursor-pointer">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-md shadow-blue-100 group-hover:scale-105 transition-transform">
          {user.name ? user.name.charAt(0).toUpperCase() : "?"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-sm leading-snug truncate group-hover:text-blue-600 transition-colors">
            <Highlight text={user.name} query={query} />
          </h3>
          {user.headline && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              <Highlight text={user.headline} query={query} />
            </p>
          )}
          {user.organization && (
            <p className="text-xs text-slate-400 truncate">{user.organization}</p>
          )}
        </div>
      </Link>

      {/* Skills */}
      {user.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {user.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="bg-blue-50 text-blue-600 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-blue-100"
            >
              <Highlight text={skill} query={query} />
            </span>
          ))}
        </div>
      )}

      {/* Connect button */}
      <button
        onClick={handleConnect}
        disabled={connecting || connected}
        className={`
          w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
          ${connected
            ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 active:scale-95"
          }
        `}
      >
        {connecting ? (
          <Loader2 size={14} className="animate-spin" />
        ) : connected ? (
          "✓ Connected"
        ) : (
          <>
            <UserPlus size={14} /> Connect
          </>
        )}
      </button>
    </div>
  );
}

// ─── Group Card ───────────────────────────────────────────────────────────────
function GroupCard({ group, query, onJoin }) {
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await onJoin(group._id);
      setJoined(true);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-2xl shrink-0">
          {group.icon || "💼"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-sm leading-snug">
            <Highlight text={group.name} query={query} />
          </h3>
          {group.domain && (
            <span className="inline-block mt-1 bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-100">
              {group.domain}
            </span>
          )}
        </div>
      </div>

      {group.description && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
          <Highlight text={group.description} query={query} />
        </p>
      )}

      <button
        onClick={handleJoin}
        disabled={joining || joined}
        className={`
          w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
          ${joined
            ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
            : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 active:scale-95"
          }
        `}
      >
        {joining ? (
          <Loader2 size={14} className="animate-spin" />
        ) : joined ? (
          "✓ Joined"
        ) : (
          <>
            <Users size={14} /> Join Group
          </>
        )}
      </button>
    </div>
  );
}

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-slate-100 rounded-lg w-3/4" />
          <div className="h-2.5 bg-slate-100 rounded-lg w-1/2" />
        </div>
      </div>
      <div className="flex gap-1.5 mb-4">
        <div className="h-5 bg-slate-100 rounded-lg w-16" />
        <div className="h-5 bg-slate-100 rounded-lg w-12" />
        <div className="h-5 bg-slate-100 rounded-lg w-20" />
      </div>
      <div className="h-9 bg-slate-100 rounded-xl w-full" />
    </div>
  );
}

// ─── Main page content (needs useSearchParams — wrapped in Suspense) ──────────
function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";

  const [query, setQuery] = useState(q);
  const [results, setResults] = useState({ users: [], groups: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { fetchProfile } = useProfile();

  // Fetch results when query changes
  useEffect(() => {
    if (!q.trim()) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/search?q=${encodeURIComponent(q)}`);
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [q]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleConnect = async (userId) => {
    try {
      await api.post(`/user/connect/${userId}`);
      fetchProfile();
    } catch {
      // endpoint may not exist yet — just optimistically update UI
    }
  };

  const handleJoin = async (groupId) => {
    try {
      await api.post(`/group/${groupId}/join`);
    } catch {
      // same as above
    }
  };

  const tabs = [
    { id: "all",    label: "All",    count: results.users.length + results.groups.length },
    { id: "people", label: "People", count: results.users.length  },
    { id: "groups", label: "Groups", count: results.groups.length },
  ];

  const showUsers  = activeTab === "all" || activeTab === "people";
  const showGroups = activeTab === "all" || activeTab === "groups";
  const isEmpty = !loading && q && results.users.length === 0 && results.groups.length === 0;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-8 mt-12 lg:mt-0">
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Search</h1>
            <p className="text-slate-500 text-sm">Find people, skills, and groups on BizCircle</p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-blue-400 focus-within:shadow-blue-50 focus-within:shadow-md transition-all duration-200">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search people, skills, groups…"
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); router.push("/dashboard/search"); }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-md shadow-blue-200 flex items-center gap-1.5"
              >
                Search <ArrowRight size={14} />
              </button>
            </div>
          </form>

          {/* Only show tabs/results when there's a query */}
          {q && (
            <>
              {/* Tabs */}
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all duration-200 border-b-2 -mb-px
                      ${activeTab === tab.id
                        ? "text-blue-600 border-blue-500 bg-blue-50"
                        : "text-slate-500 border-transparent hover:text-blue-500 hover:bg-slate-50"
                      }
                    `}
                  >
                    {tab.label}
                    {!loading && (
                      <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                        activeTab === tab.id ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Results headline */}
              {!loading && q && !isEmpty && (
                <p className="text-xs text-slate-400 mb-5">
                  Showing results for <span className="font-semibold text-slate-600">&quot;{q}&quot;</span>
                </p>
              )}

              {/* Loading skeletons */}
              {loading && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {/* Empty state */}
              {isEmpty && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Search size={28} className="text-slate-300" />
                  </div>
                  <h3 className="font-bold text-slate-700 mb-1">No results found</h3>
                  <p className="text-sm text-slate-400">
                    Try a different keyword — e.g. a name, skill, or group topic
                  </p>
                </div>
              )}

              {/* People section */}
              {!loading && showUsers && results.users.length > 0 && (
                <section className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                      <User size={14} className="text-blue-500" />
                    </div>
                    <h2 className="font-bold text-slate-800 text-base">
                      People
                      <span className="ml-2 text-xs font-semibold text-slate-400">({results.users.length})</span>
                    </h2>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.users.map((u) => (
                      <UserCard key={u._id} user={u} query={q} onConnect={handleConnect} />
                    ))}
                  </div>
                </section>
              )}

              {/* Groups section */}
              {!loading && showGroups && results.groups.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Users size={14} className="text-blue-500" />
                    </div>
                    <h2 className="font-bold text-slate-800 text-base">
                      Groups
                      <span className="ml-2 text-xs font-semibold text-slate-400">({results.groups.length})</span>
                    </h2>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.groups.map((g) => (
                      <GroupCard key={g._id} group={g} query={q} onJoin={handleJoin} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* Empty prompt (no query yet) */}
          {!q && (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-blue-400" />
              </div>
              <h3 className="font-bold text-slate-700 mb-1">Start searching</h3>
              <p className="text-sm text-slate-400">Search by name, skill, or group to discover connections</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Page export (wraps content in Suspense for useSearchParams) ──────────────
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-[#F8FAFC] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-500" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
