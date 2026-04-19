"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, User, Users } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ users: [], groups: [] });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const debouncedQuery = useDebounce(query, 300);

  // Fetch dropdown suggestions
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults({ users: [], groups: [] });
      setOpen(false);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        setResults({
          users: (data.users || []).slice(0, 4),
          groups: (data.groups || []).slice(0, 3),
        });
        setOpen(true);
      } catch {
        // silently fail — don't break the sidebar
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      setOpen(false);
      router.push(`/dashboard/search?q=${encodeURIComponent(query.trim())}`);
    }
    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  const clearQuery = () => {
    setQuery("");
    setResults({ users: [], groups: [] });
    setOpen(false);
    inputRef.current?.focus();
  };

  const navigateToResults = (q) => {
    setOpen(false);
    router.push(`/dashboard/search?q=${encodeURIComponent(q)}`);
  };

  const hasResults = results.users.length > 0 || results.groups.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full mb-6 px-2">
      {/* Input */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-md focus-within:shadow-blue-50 transition-all duration-200">
        <Search size={15} className="text-slate-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => hasResults && setOpen(true)}
          placeholder="Search people, skills, groups…"
          className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none min-w-0"
        />
        {loading && (
          <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {!loading && query && (
          <button onClick={clearQuery} className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-2 right-2 top-[calc(100%+6px)] z-50 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden">
          {hasResults ? (
            <>
              {/* Users */}
              {results.users.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-4 pt-3 pb-1.5">
                    <User size={11} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">People</span>
                  </div>
                  {results.users.map((u) => (
                    <button
                      key={u._id}
                      onClick={() => navigateToResults(query)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {u.name ? u.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                          {u.name}
                        </p>
                        {u.headline && (
                          <p className="text-xs text-slate-400 truncate">{u.headline}</p>
                        )}
                        {!u.headline && u.skills?.length > 0 && (
                          <p className="text-xs text-slate-400 truncate">{u.skills.slice(0, 2).join(" · ")}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Groups */}
              {results.groups.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-4 pt-3 pb-1.5">
                    <Users size={11} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Groups</span>
                  </div>
                  {results.groups.map((g) => (
                    <button
                      key={g._id}
                      onClick={() => navigateToResults(query)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-base shrink-0">
                        {g.icon || "💼"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                          {g.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{g.domain || g.category || "Group"}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Footer link */}
              <div className="px-4 pt-2 pb-3 border-t border-slate-50 mt-1">
                <button
                  onClick={() => navigateToResults(query)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                >
                  <Search size={11} />
                  See all results for &quot;{query}&quot;
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-slate-400">No results for &quot;{query}&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
