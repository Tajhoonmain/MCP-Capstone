import React from "react";
import { motion } from "framer-motion";
import { Clock, RotateCcw } from "lucide-react";

interface HistoryItem {
  query: string;
  timestamp: string;
  result: any;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onQuery: (query: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onQuery }) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const getQueryPreview = (query: string) => {
    return query.length > 25 ? query.substring(0, 25) + "..." : query;
  };

  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-xl border border-[#2A3044] bg-[#161B27] p-6 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#64748B]" />
          <h2
            className="text-sm font-semibold text-[#94A3B8] uppercase tracking-widest"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Query History
          </h2>
        </div>
        
        <div className="text-center py-8">
          <Clock className="w-8 h-8 mx-auto mb-3 text-[#475569]" />
          <p className="text-sm text-[#475569]" style={{ fontFamily: "Manrope, sans-serif" }}>
            No queries yet
          </p>
          <p className="text-xs text-[#334155] mt-1" style={{ fontFamily: "Manrope, sans-serif" }}>
            Start by asking a question above
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-xl border border-[#2A3044] bg-[#161B27] p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#64748B]" />
          <h2
            className="text-sm font-semibold text-[#94A3B8] uppercase tracking-widest"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Query History
          </h2>
        </div>
        
        {history.length > 0 && (
          <motion.button
            onClick={() => onQuery("")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs text-[#475569] hover:text-[#6366F1] transition-colors duration-200 flex items-center gap-1"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </motion.button>
        )}
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {history.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            onClick={() => onQuery(item.query)}
            className="p-3 rounded-lg border border-[#2A3044] hover:border-[#6366F1]/40 hover:bg-[#0F1117] cursor-pointer transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#E2E8F0] font-medium" style={{ fontFamily: "Manrope, sans-serif" }}>
                  {getQueryPreview(item.query)}
                </p>
                <p className="text-xs text-[#475569] mt-1" style={{ fontFamily: "Manrope, sans-serif" }}>
                  {formatTimestamp(item.timestamp)}
                </p>
              </div>
              
              {item.result && typeof item.result === 'object' && item.result.text && (
                <div className="text-xs text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded">
                  Success
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HistoryPanel;
