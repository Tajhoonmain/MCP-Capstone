import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Loader2 } from "lucide-react";

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-xl border border-[#2A3044] bg-[#161B27] p-6 shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] transition-shadow duration-300"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
        <h2
          className="text-sm font-semibold text-[#94A3B8] uppercase tracking-widest"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Query Input
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Calculate my GPA..."
            disabled={isLoading}
            rows={4}
            className="w-full rounded-lg border border-[#2A3044] bg-[#0F1117] px-4 py-3 text-sm text-[#E2E8F0] placeholder-[#475569] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] resize-none transition-colors duration-200 disabled:opacity-60"
            style={{ fontFamily: "Manrope, sans-serif" }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e);
              }
            }}
          />
          <div className="absolute bottom-3 right-3 text-xs text-[#334155]" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            ⌘↵
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading || !query.trim()}
          whileHover={{ scale: isLoading || !query.trim() ? 1 : 1.02 }}
          whileTap={{ scale: isLoading || !query.trim() ? 1 : 0.98 }}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#6366F1] hover:bg-[#5558E8] disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running Query...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Query
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default QueryInput;
