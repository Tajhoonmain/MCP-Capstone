import React from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";

interface ContextCardProps {
  context: Record<string, unknown> | null;
}

const ContextCard: React.FC<ContextCardProps> = ({ context }) => {
  const isEmpty = !context || Object.keys(context).length === 0;

  const renderValue = (value: unknown): string => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  // Map common context keys to display labels
  const getLabelForKey = (key: string): string => {
    const labels: Record<string, string> = {
      student_name: "Student Name",
      studentName: "Student Name",
      name: "Student Name",
      semester: "Semester",
      department: "Department",
      student_id: "Student ID",
      studentId: "Student ID",
      id: "ID",
      email: "Email",
      gpa: "GPA",
      credits: "Credits",
      year: "Year",
    };
    return labels[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-xl border border-[#2A3044] bg-[#161B27] p-6 shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] transition-shadow duration-300"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
        <h2
          className="text-sm font-semibold text-[#94A3B8] uppercase tracking-widest"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Context
        </h2>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1E2535] flex items-center justify-center">
            <User className="w-5 h-5 text-[#475569]" />
          </div>
          <p className="text-sm text-[#475569]" style={{ fontFamily: "Manrope, sans-serif" }}>
            Awaiting query response...
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {Object.entries(context).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start justify-between gap-4 py-2 border-b border-[#1E2535] last:border-0"
            >
              <span
                className="text-xs font-medium text-[#64748B] uppercase tracking-wide flex-shrink-0"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {getLabelForKey(key)}
              </span>
              <span
                className="text-sm text-[#CBD5E1] text-right"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                {renderValue(value)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ContextCard;
