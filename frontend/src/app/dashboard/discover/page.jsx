"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import api from "@/lib/axios";
import {
  Search, X, User, Users, UserPlus, Loader2, Compass
} from "lucide-react";
import Link from "next/link";
import { useProfile } from "@/lib/useProfile";

/* ─────────────────────────────────────────────────────────────────────────────
   DEBOUNCE HOOK
───────────────────────────────────────────────────────────────────────────── */
function useDebounce(value, delay) {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

/* ─────────────────────────────────────────────────────────────────────────────
   HIGHLIGHT MATCH
───────────────────────────────────────────────────────────────────────────── */
function Hl({ text = "", q = "" }) {
  if (!q || !text) return <>{text}</>;
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${safe})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="bg-blue-100 text-blue-700 rounded px-0.5 font-semibold not-italic">{p}</mark>
        ) : p
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3.5 bg-slate-100 rounded-lg w-2/3" />
          <div className="h-2.5 bg-slate-100 rounded-lg w-1/2" />
        </div>
      </div>
      <div className="flex gap-1.5 mb-4">
        <div className="h-5 bg-slate-100 rounded-lg w-14" />
        <div className="h-5 bg-slate-100 rounded-lg w-16" />
        <div className="h-5 bg-slate-100 rounded-lg w-12" />
      </div>
      <div className="h-9 bg-slate-100 rounded-xl w-full" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   USER CARD
───────────────────────────────────────────────────────────────────────────── */
function UserCard({ user, query = "" }) {
  const [status, setStatus] = useState("idle");
  const { fetchProfile } = useProfile();

  const handleConnect = async () => {
    setStatus("loading");
    try { 
      await api.post(`/user/connect/${user._id}`); 
      fetchProfile();
    } catch { /* optimistic */ }
    setStatus("done");
  };

  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 flex flex-col gap-4 group">
      <Link href={`/user/${user._id}`} className="flex items-start gap-4 cursor-pointer">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-base shadow-md shadow-blue-100 shrink-0 group-hover:scale-105 transition-transform">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-sm leading-snug truncate group-hover:text-blue-600 transition-colors">
            {query ? <Hl text={user.name} q={query} /> : user.name}
          </h3>
          {user.headline && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {query ? <Hl text={user.headline} q={query} /> : user.headline}
            </p>
          )}
          {!user.headline && user.organization && (
            <p className="text-xs text-slate-400 truncate">{user.organization}</p>
          )}
        </div>
      </Link>

      {user.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {user.skills.slice(0, 4).map(s => (
            <span key={s} className="bg-blue-50 text-blue-600 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-blue-100">
              {query ? <Hl text={s} q={query} /> : s}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={handleConnect}
        disabled={status !== "idle"}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          status === "done"
            ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 active:scale-95"
        }`}
      >
        {status === "loading" ? <Loader2 size={14} className="animate-spin" />
          : status === "done" ? "✓ Connected"
          : <><UserPlus size={14} /> Connect</>}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GROUP CARD
───────────────────────────────────────────────────────────────────────────── */
function GroupCard({ group, query = "" }) {
  const [status, setStatus] = useState("idle");

  const handleJoin = async () => {
    setStatus("loading");
    try { await api.post(`/group/${group._id}/join`); } catch { /* optimistic */ }
    setStatus("done");
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 flex flex-col gap-4 group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
          {group.icon || "💼"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-sm leading-snug">
            {query ? <Hl text={group.name} q={query} /> : group.name}
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
          {query ? <Hl text={group.description} q={query} /> : group.description}
        </p>
      )}

      <button
        onClick={handleJoin}
        disabled={status !== "idle"}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 mt-auto ${
          status === "done"
            ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
            : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 active:scale-95"
        }`}
      >
        {status === "loading" ? <Loader2 size={14} className="animate-spin" />
          : status === "done" ? "✓ Joined"
          : <><Users size={14} /> Join Group</>}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────────────────────────────────────── */
function SectionHeader({ icon, title, count }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
        {icon}
      </div>
      <h2 className="font-bold text-slate-800 text-lg">{title}</h2>
      {count !== undefined && (
        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────────────────────────────────────── */
function EmptyState({ query }) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <Search size={28} className="text-slate-300" />
      </div>
      <h3 className="font-bold text-slate-700 mb-1">No results found</h3>
      <p className="text-sm text-slate-400">
        No matches for <span className="font-semibold text-slate-500">&quot;{query}&quot;</span> — try a different name, skill, or topic
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN CONTENT
───────────────────────────────────────────────────────────────────────────── */
function ExploreContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState("all");
  const [searchResults, setSearchResults] = useState({ users: [], groups: [] });
  const [searching, setSearching] = useState(false);
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [discoverGroups, setDiscoverGroups] = useState([]);
  const [loadingDiscover, setLoadingDiscover] = useState(true);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    Promise.all([
      api.get("/api/discover/users").catch(() => ({ data: [] })),
      api.get("/api/discover/groups").catch(() => ({ data: [] })),
    ]).then(([u, g]) => {
      setDiscoverUsers(u.data || []);
      setDiscoverGroups(g.data || []);
    }).finally(() => setLoadingDiscover(false));
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults({ users: [], groups: [] });
      return;
    }
    const run = async () => {
      setSearching(true);
      try {
        const { data } = await api.get(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        setSearchResults(data);
      } catch { /* silent */ }
      finally { setSearching(false); }
    };
    run();
  }, [debouncedQuery]);

  const clearQuery = () => { setQuery(""); inputRef.current?.focus(); };
  const isSearching = !!query.trim();
  const isEmpty = isSearching && !searching && searchResults.users.length === 0 && searchResults.groups.length === 0;

  const tabs = [
    { id: "all",    label: "All",    count: searchResults.users.length + searchResults.groups.length },
    { id: "people", label: "People", count: searchResults.users.length },
    { id: "groups", label: "Groups", count: searchResults.groups.length },
  ];
  const showPeople = !isSearching || activeTab === "all" || activeTab === "people";
  const showGroups = !isSearching || activeTab === "all" || activeTab === "groups";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 mt-12 lg:mt-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md shadow-blue-200">
                <Compass size={18} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Explore</h1>
            </div>
            <p className="text-slate-500 text-sm ml-12">
              Discover people and groups — or search by name, skill, or topic
            </p>
          </div>

          <div className="relative mb-8">
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm focus-within:border-blue-400 focus-within:shadow-md focus-within:shadow-blue-50 transition-all duration-200">
              {searching
                ? <Loader2 size={18} className="text-blue-400 shrink-0 animate-spin" />
                : <Search size={18} className="text-slate-400 shrink-0" />
              }
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search people, skills, groups..."
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
                autoFocus
              />
              {query && (
                <button onClick={clearQuery} className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                  <X size={16} />
                </button>
              )}
            </div>
            {!isSearching && (
              <p className="text-center text-xs text-slate-400 mt-3">
                Type a name, skill (e.g. <span className="font-medium text-slate-500">React</span>) or group topic to search
              </p>
            )}
          </div>

          {isSearching && (
            <>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-px">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all duration-200 border-b-2 -mb-px ${
                      activeTab === t.id
                        ? "text-blue-600 border-blue-500 bg-blue-50"
                        : "text-slate-500 border-transparent hover:text-blue-500 hover:bg-slate-50"
                    }`}
                  >
                    {t.label}
                    {!searching && (
                      <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                        activeTab === t.id ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                      }`}>
                        {t.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {!searching && !isEmpty && (
                <p className="text-xs text-slate-400 mb-6">
                  Results for <span className="font-semibold text-slate-600">&quot;{query}&quot;</span>
                </p>
              )}

              {searching && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {isEmpty && <EmptyState query={query} />}

              {!searching && showPeople && searchResults.users.length > 0 && (
                <section className="mb-10">
                  <SectionHeader
                    icon={<User size={15} className="text-blue-500" />}
                    title="People"
                    count={searchResults.users.length}
                  />
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.users.map(u => (
                      <UserCard key={u._id} user={u} query={query} />
                    ))}
                  </div>
                </section>
              )}

              {!searching && showGroups && searchResults.groups.length > 0 && (
                <section>
                  <SectionHeader
                    icon={<Users size={15} className="text-blue-500" />}
                    title="Groups"
                    count={searchResults.groups.length}
                  />
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.groups.map(g => (
                      <GroupCard key={g._id} group={g} query={query} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {!isSearching && (
            <>
              <section className="mb-12">
                <SectionHeader
                  icon={<UserPlus size={15} className="text-blue-500" />}
                  title="People You May Know"
                />
                {loadingDiscover ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : discoverUsers.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 text-sm shadow-sm">
                    No suggestions right now — check back later
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {discoverUsers.map(u => (
                      <UserCard key={u._id} user={u} />
                    ))}
                  </div>
                )}
              </section>

              <div className="flex items-center gap-4 mb-10">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Groups</span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              <section>
                <SectionHeader
                  icon={<Users size={15} className="text-blue-500" />}
                  title="Suggested Groups"
                />
                {loadingDiscover ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : discoverGroups.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 text-sm shadow-sm">
                    No group suggestions right now
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {discoverGroups.map(g => (
                      <GroupCard key={g._id} group={g} />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
          <div className="h-12" />
        </div>
      </main>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-[#F8FAFC] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-400" />
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
