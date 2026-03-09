import React from "react";
import { motion } from "framer-motion";
import { Wrench } from "lucide-react";

interface ToolListProps {
  tools: string[];
  selectedTool: string | null;
}

const ToolList: React.FC<ToolListProps> = ({ tools, selectedTool }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-xl border border-[#2A3044] bg-[#161B27] p-6 shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
          <h2
            className="text-sm font-semibold text-[#94A3B8] uppercase tracking-widest"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Available Tools
          </h2>
        </div>
        {tools.length > 0 && (
          <span
            className="text-xs text-[#475569] bg-[#1E2535] px-2 py-0.5 rounded-full"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            {tools.length}
          </span>
        )}
      </div>

      {tools.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1E2535] flex items-center justify-center">
            <Wrench className="w-5 h-5 text-[#475569]" />
          </div>
          <p className="text-sm text-[#475569]" style={{ fontFamily: "Manrope, sans-serif" }}>
            No tools available
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tools.map((tool, index) => {
            const isActive = tool === selectedTool;
            return (
              <motion.div
                key={tool}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                title={tool}
                className={`
                  relative px-3 py-1.5 rounded-lg text-xs font-medium cursor-default
                  border transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-[#6366F1]/20 border-[#6366F1] text-[#A5B4FC] shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                      : "bg-[#1E2535] border-[#2A3044] text-[#64748B] hover:border-[#6366F1]/50 hover:text-[#94A3B8] hover:shadow-[0_0_8px_rgba(99,102,241,0.15)]"
                  }
                `}
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTool"
                    className="absolute inset-0 rounded-lg bg-[#6366F1]/10"
                    transition={{ type: "spring", bounce: 0.2 }}
                  />
                )}
                <span className="relative z-10">{tool}</span>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default ToolList;
