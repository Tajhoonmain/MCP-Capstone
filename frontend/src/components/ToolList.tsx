import React from "react";
import { motion } from "framer-motion";
import { Wrench, Calculator, Calendar, BookOpen, TrendingUp, CheckSquare, User, Award } from "lucide-react";

interface ToolListProps {
  tools: string[];
  selectedTool: string | null;
}

const ToolList: React.FC<ToolListProps> = ({ tools, selectedTool }) => {
  const getToolInfo = (toolName: string) => {
    const toolMap: Record<string, { icon: any; color: string; description: string }> = {
      "calculate_gpa": {
        icon: Calculator,
        color: "bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981]",
        description: "Calculate GPA from grades"
      },
      "check_exam_schedule": {
        icon: Calendar,
        color: "bg-[#F59E0B]/20 border-[#F59E0B]/40 text-[#F59E0B]",
        description: "Get exam schedules"
      },
      "register_course": {
        icon: BookOpen,
        color: "bg-[#8B5CF6]/20 border-[#8B5CF6]/40 text-[#8B5CF6]",
        description: "Register for courses"
      },
      "predict_grade": {
        icon: TrendingUp,
        color: "bg-[#EC4899]/20 border-[#EC4899]/40 text-[#EC4899]",
        description: "Predict final grades"
      },
      "track_assignment": {
        icon: CheckSquare,
        color: "bg-[#14B8A6]/20 border-[#14B8A6]/40 text-[#14B8A6]",
        description: "Track assignments"
      },
      "get_student_info": {
        icon: User,
        color: "bg-[#6366F1]/20 border-[#6366F1]/40 text-[#6366F1]",
        description: "View student information"
      },
      "calculate_credits_needed": {
        icon: Award,
        color: "bg-[#F97316]/20 border-[#F97316]/40 text-[#F97316]",
        description: "Calculate graduation credits"
      }
    };
    return toolMap[toolName] || {
      icon: Wrench,
      color: "bg-[#475569]/20 border-[#475569]/40 text-[#475569]",
      description: "Unknown tool"
    };
  };

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
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {tools.map((tool, index) => {
            const isActive = tool === selectedTool;
            const toolInfo = getToolInfo(tool);
            const Icon = toolInfo.icon;
            
            return (
              <motion.div
                key={tool}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  relative p-3 rounded-lg border cursor-pointer transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#6366F1]/10 border-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                      : "bg-[#1E2535] border-[#2A3044] hover:border-[#6366F1]/50 hover:bg-[#0F1117] hover:shadow-[0_0_8px_rgba(99,102,241,0.15)]"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${toolInfo.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[#E2E8F0]" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        {tool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-[#10B981]"
                        />
                      )}
                    </div>
                    <p className="text-xs text-[#64748B]" style={{ fontFamily: "Manrope, sans-serif" }}>
                      {toolInfo.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default ToolList;
