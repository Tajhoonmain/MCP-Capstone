import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu } from "lucide-react";

export type ExecutionStatus = "idle" | "running" | "success" | "error";

interface ExecutionPanelProps {
  status: ExecutionStatus;
  selectedTool: string | null;
  parameters: Record<string, unknown> | null;
  errorMessage?: string;
}

const statusConfig: Record<
  ExecutionStatus,
  { label: string; color: string; bg: string; dot: string; pulse: boolean }
> = {
  idle: {
    label: "Idle",
    color: "text-[#64748B]",
    bg: "bg-[#64748B]/10 border-[#64748B]/30",
    dot: "bg-[#64748B]",
    pulse: false,
  },
  running: {
    label: "Running",
    color: "text-[#F59E0B]",
    bg: "bg-[#F59E0B]/10 border-[#F59E0B]/30",
    dot: "bg-[#F59E0B]",
    pulse: true,
  },
  success: {
    label: "Success",
    color: "text-[#10B981]",
    bg: "bg-[#10B981]/10 border-[#10B981]/30",
    dot: "bg-[#10B981]",
    pulse: false,
  },
  error: {
    label: "Error",
    color: "text-[#F43F5E]",
    bg: "bg-[#F43F5E]/10 border-[#F43F5E]/30",
    dot: "bg-[#F43F5E]",
    pulse: false,
  },
};

const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  status,
  selectedTool,
  parameters,
  errorMessage,
}) => {
  const cfg = statusConfig[status];
  const hasParams = parameters && Object.keys(parameters).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-xl border border-[#2A3044] bg-[#161B27] p-6 shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
          <h2
            className="text-sm font-semibold text-[#94A3B8] uppercase tracking-widest"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Execution
          </h2>
        </div>

        {/* Status Pill */}
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${cfg.bg} ${cfg.color}`}
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? "animate-pulse" : ""}`} />
            {cfg.label}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-4">
        {/* Selected Tool */}
        <div>
          <p
            className="text-xs text-[#475569] uppercase tracking-wide mb-1"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Selected Tool
          </p>
          <AnimatePresence mode="wait">
            {selectedTool ? (
              <motion.p
                key={selectedTool}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-[#A5B4FC] bg-[#6366F1]/10 border border-[#6366F1]/30 rounded-lg px-3 py-2"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {selectedTool}
              </motion.p>
            ) : (
              <p
                className="text-sm text-[#334155] bg-[#1E2535] rounded-lg px-3 py-2"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                —
              </p>
            )}
          </AnimatePresence>
        </div>

        {/* Parameters */}
        <div>
          <p
            className="text-xs text-[#475569] uppercase tracking-wide mb-2"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Parameters
          </p>
          <AnimatePresence mode="wait">
            {hasParams ? (
              <motion.div
                key="params"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-lg border border-[#2A3044] bg-[#0F1117] p-3 space-y-1.5"
              >
                {Object.entries(parameters!).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="flex items-start justify-between gap-3"
                  >
                    <span
                      className="text-xs text-[#64748B] flex-shrink-0"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {key}:
                    </span>
                    <span
                      className="text-xs text-[#94A3B8] text-right break-all"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            ) : status === "idle" ? (
              <div className="flex flex-col items-center justify-center py-4 gap-2">
                <Cpu className="w-5 h-5 text-[#334155]" />
                <p
                  className="text-xs text-[#334155]"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  No parameters yet
                </p>
              </div>
            ) : (
              <p
                className="text-xs text-[#475569] bg-[#1E2535] rounded-lg px-3 py-2"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {}
              </p>
            )}
          </AnimatePresence>
        </div>

        {/* Error Message */}
        {status === "error" && errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-[#F43F5E]/30 bg-[#F43F5E]/10 px-3 py-2"
          >
            <p
              className="text-xs text-[#F43F5E]"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {errorMessage}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ExecutionPanel;
