"use client";
import { useState } from "react";
import api from "@/lib/axios";
import { X, BarChart2, Plus, Minus, HelpCircle } from "lucide-react";

export default function CreatePollModal({ groupId, onClose, onCreated }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError("Poll question is required");
      return;
    }
    const filteredOptions = options.filter(opt => opt.trim() !== "");
    if (filteredOptions.length < 2) {
      setError("At least two options are required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/api/polls", {
        group: groupId,
        question: question.trim(),
        options: filteredOptions,
      });
      onCreated(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create poll. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl font-bold">Create a Poll</h2>
            <p className="text-blue-100 text-sm">Ask your circle for their opinion</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">
                <HelpCircle className="w-4 h-4" />
              </span>
              Question
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
              placeholder="e.g. Which logo do you prefer?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">
                <BarChart2 className="w-4 h-4" />
              </span>
              Options (Max 5)
            </label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  required
                  className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            
            {options.length < 5 && (
              <button
                type="button"
                onClick={addOption}
                className="w-full py-3 border-2 border-dashed border-gray-100 text-gray-400 hover:border-blue-200 hover:text-blue-500 rounded-xl transition-all flex items-center justify-center font-bold text-sm"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Option
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {submitting ? "Publishing..." : "✦ Publish Poll"}
          </button>
        </form>
      </div>
    </div>
  );
}
