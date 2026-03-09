import React, { useState } from "react";
import { motion } from "framer-motion";
import { runQuery, MCPResponse } from "@/services/api";
import QueryInput from "@/components/QueryInput";
import ContextCard from "@/components/ContextCard";
import ToolList from "@/components/ToolList";
import ExecutionPanel, { ExecutionStatus } from "@/components/ExecutionPanel";
import ResponsePanel from "@/components/ResponsePanel";
import QuickActions from "@/components/QuickActions";
import HistoryPanel from "@/components/HistoryPanel";

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<ExecutionStatus>("idle");
  const [context, setContext] = useState<Record<string, unknown> | null>(null);
  const [tools, setTools] = useState<string[]>([]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [parameters, setParameters] = useState<Record<string, unknown> | null>(null);
  const [responseData, setResponseData] = useState<Record<string, unknown> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [queryHistory, setQueryHistory] = useState<Array<{query: string, timestamp: string, result: any}>>([]);

  const handleQuery = async (query: string) => {
    setIsLoading(true);
    setStatus("running");
    setErrorMessage(undefined);

    try {
      const data: MCPResponse = await runQuery(query);

      setContext(data.context ?? null);
      setTools(Array.isArray(data.tools) ? data.tools : []);
      setSelectedTool(data.selected_tool ?? null);
      setParameters(data.parameters ?? null);
      setResponseData(data.result ?? (data as unknown as Record<string, unknown>));
      setStatus("success");

      // Add to history
      setQueryHistory(prev => [
        { query, timestamp: new Date().toISOString(), result: data.result },
        ...prev.slice(0, 9) // Keep last 10 queries
      ]);

    } catch (err: unknown) {
      const errorPayload =
        err && typeof err === "object"
          ? (err as Record<string, unknown>)
          : { error: String(err) };

      setResponseData(errorPayload);
      setStatus("error");
      setErrorMessage(
        typeof errorPayload.error === "string"
          ? errorPayload.error
          : typeof errorPayload.message === "string"
          ? errorPayload.message
          : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    handleQuery(action);
  };

  return (
    <div
      className="min-h-screen bg-[#0F1117] text-white relative overflow-x-hidden"
      style={{ fontFamily: "Manrope, sans-serif" }}
    >
      {/* Dot-grid background texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #2A3044 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.4,
        }}
      />

      {/* Header Bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 border-b border-[#2A3044] bg-[#161B27]/80 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#6366F1]/20 border border-[#6366F1]/40 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-[#6366F1]"
                >
                  <path
                    d="M8 1L15 4.5V11.5L8 15L1 11.5V4.5L8 1Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 8L15 4.5M8 8L1 4.5M8 8V15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h1
                  className="text-base font-bold text-white leading-none"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  MCP University Assistant
                </h1>
                <p
                  className="text-xs text-[#475569] mt-0.5"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  Enhanced Academic Assistant • {tools.length} Tools Available
                </p>
              </div>
            </div>
          </div>

          {/* Connection status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2A3044] bg-[#0F1117]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
            </span>
            <span
              className="text-xs text-[#64748B]"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Connected to MCP Server
            </span>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Left Column — 40% */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <QueryInput onSubmit={handleQuery} isLoading={isLoading} />
            <ContextCard context={context} />
            <QuickActions onAction={handleQuickAction} isLoading={isLoading} />
          </div>

          {/* Middle Column — 30% */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ToolList tools={tools} selectedTool={selectedTool} />
            <ExecutionPanel
              status={status}
              selectedTool={selectedTool}
              parameters={parameters}
              errorMessage={errorMessage}
            />
          </div>

          {/* Right Column — 30% */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ResponsePanel data={responseData} />
            <HistoryPanel history={queryHistory} onQuery={handleQuery} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
