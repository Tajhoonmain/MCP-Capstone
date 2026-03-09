import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Code2 } from "lucide-react";

interface ResponsePanelProps {
  data: Record<string, unknown> | null;
}

const syntaxHighlight = (json: string): string => {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = "text-[#7DD3FC]"; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "text-[#A5B4FC]"; // key
          } else {
            cls = "text-[#86EFAC]"; // string value
          }
        } else if (/true|false/.test(match)) {
          cls = "text-[#FDA4AF]"; // boolean
        } else if (/null/.test(match)) {
          cls = "text-[#94A3B8]"; // null
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
};

const ResponsePanel: React.FC<ResponsePanelProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const isEmpty = !data || Object.keys(data).length === 0;
  const jsonString = isEmpty ? "" : JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    if (jsonString) {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-xl border border-[#2A3044] bg-[#161B27] p-6 shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
          <h2
            className="text-sm font-semibold text-[#94A3B8] uppercase tracking-widest"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Response
          </h2>
        </div>

        <AnimatePresence mode="wait">
          {!isEmpty && (
            <motion.button
              key="copy-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2A3044] bg-[#1E2535] hover:border-[#6366F1]/50 hover:bg-[#6366F1]/10 text-[#64748B] hover:text-[#A5B4FC] transition-all duration-200 text-xs"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center gap-1.5 text-[#10B981]"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy JSON
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="rounded-lg border border-[#2A3044] bg-[#0F1117] overflow-hidden min-h-[200px]">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-[200px] gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1E2535] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-[#475569]" />
            </div>
            <p
              className="text-sm text-[#475569]"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Response will appear here...
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Code header bar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1E2535] bg-[#0D1117]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/60" />
              </div>
              <span
                className="text-xs text-[#334155] ml-2"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                response.json
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 overflow-auto max-h-[420px]"
            >
              <pre
                className="text-xs leading-relaxed"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
                dangerouslySetInnerHTML={{
                  __html: syntaxHighlight(jsonString),
                }}
              />
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResponsePanel;
