"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { UserPlus, Users, Loader2, ChevronRight } from "lucide-react";
import { useProfile } from "@/lib/useProfile";
import Link from "next/link";

// ─── User Suggestion Card ────────────────────────────────────────────────────
function UserSuggestionCard({ user }) {
  const [status, setStatus] = useState("idle"); // idle | connecting | done
  const { fetchProfile } = useProfile();

  const handleConnect = async () => {
    setStatus("connecting");
    try {
      await api.post(`/user/connect/${user._id}`);
      fetchProfile();
    } catch {
      // optimistic update regardless
    } finally {
      setStatus("done");
    }
  };

  return (
    <div className="shrink-0 w-52 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 flex flex-col gap-3">
      {/* Avatar + name */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-100">
          {user.name ? user.name.charAt(0).toUpperCase() : "?"}
        </div>
        <div>
          <p className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">{user.name}</p>
          {user.headline && (
            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{user.headline}</p>
          )}
          {!user.headline && user.organization && (
            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{user.organization}</p>
          )}
        </div>
      </div>

      {/* Skills */}
      {user.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center">
          {user.skills.slice(0, 3).map((s) => (
            <span key={s} className="bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-lg border border-blue-100">
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Connect button */}
      <button
        onClick={handleConnect}
        disabled={status !== "idle"}
        className={`
          w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200
          ${status === "done"
            ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 active:scale-95"
          }
        `}
      >
        {status === "connecting" ? (
          <Loader2 size={12} className="animate-spin" />
        ) : status === "done" ? (
          "✓ Connected"
        ) : (
          <>
            <UserPlus size={12} /> Connect
          </>
        )}
      </button>
    </div>
  );
}

// ─── Circle Suggestion Card ────────────────────────────────────────────────────
function CircleSuggestionCard({ group }) {
  const [status, setStatus] = useState("idle");

  const handleJoin = async () => {
    setStatus("joining");
    try {
      await api.post(`/api/circles/join`, { circleId: group._id });
    } catch {
      // optimistic
    } finally {
      setStatus("done");
    }
  };

  return (
    <div className="shrink-0 w-56 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 flex flex-col gap-3">
      {/* Icon + name */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xl shrink-0">
          {group.icon || "💼"}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">{group.name}</p>
          {group.domain && (
            <span className="inline-block mt-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-100">
              {group.domain}
            </span>
          )}
        </div>
      </div>

      {group.description && (
        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{group.description}</p>
      )}

      {/* Join button */}
      <button
        onClick={handleJoin}
        disabled={status !== "idle"}
        className={`
          w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 mt-auto
          ${status === "done"
            ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
            : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 active:scale-95"
          }
        `}
      >
        {status === "joining" ? (
          <Loader2 size={12} className="animate-spin" />
        ) : status === "done" ? (
          "✓ Requested"
        ) : (
          <>
            <Users size={12} /> Join Circle
          </>
        )}
      </button>
    </div>
  );
}

// ─── Skeleton placeholder card ────────────────────────────────────────────────
function SkeletonCard({ wide }) {
  return (
    <div className={`shrink-0 ${wide ? "w-56" : "w-52"} bg-white border border-slate-100 rounded-2xl p-4 shadow-sm animate-pulse`}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-100" />
        <div className="w-24 h-3 bg-slate-100 rounded-lg" />
        <div className="w-16 h-2.5 bg-slate-100 rounded-lg" />
        <div className="flex gap-1">
          <div className="w-10 h-4 bg-slate-100 rounded-lg" />
          <div className="w-12 h-4 bg-slate-100 rounded-lg" />
        </div>
        <div className="w-full h-7 bg-slate-100 rounded-xl mt-1" />
      </div>
    </div>
  );
}

// ─── Section wrapper with horizontal scroll ───────────────────────────────────
function DiscoverRow({ title, icon, children, loading, empty, viewAllHref }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            {icon}
          </div>
          <h2 className="font-bold text-slate-800 text-base">{title}</h2>
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all <ChevronRight size={13} />
          </Link>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} wide={title.includes("Group")} />)
          : empty
          ? (
            <div className="w-full flex items-center justify-center py-10 text-sm text-slate-400">
              Nothing to show here yet
            </div>
          )
          : children
        }
      </div>
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────
const DiscoverSection = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);

  useEffect(() => {
    // Fetch suggested users
    api.get("/api/discover/users")
      .then(({ data }) => setSuggestedUsers(data))
      .catch(() => {})
      .finally(() => setLoadingUsers(false));

    // Fetch suggested circles
    api.get("/api/circles")
      .then(({ data }) => setSuggestedGroups(data.slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoadingGroups(false));
  }, []);

  return (
    <div className="mt-8">
      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Discover</span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      {/* People You May Know */}
      <DiscoverRow
        title="People You May Know"
        icon={<UserPlus size={14} className="text-blue-500" />}
        loading={loadingUsers}
        empty={!loadingUsers && suggestedUsers.length === 0}
        viewAllHref="/dashboard/search?q="
      >
        {suggestedUsers.map((u) => (
          <UserSuggestionCard key={u._id} user={u} />
        ))}
      </DiscoverRow>

      {/* Suggested Circles */}
      <DiscoverRow
        title="Suggested Circles"
        icon={<Users size={14} className="text-blue-500" />}
        loading={loadingGroups}
        empty={!loadingGroups && suggestedGroups.length === 0}
        viewAllHref="/dashboard/circles"
      >
        {suggestedGroups.map((g) => (
          <CircleSuggestionCard key={g._id} group={g} />
        ))}
      </DiscoverRow>
    </div>
  );
};

export default DiscoverSection;
