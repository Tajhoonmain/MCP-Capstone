export interface MCPResponse {
  context: Record<string, unknown>;
  tools: string[];
  selected_tool: string;
  parameters: Record<string, unknown>;
  result: Record<string, unknown>;
}

export async function runQuery(query: string): Promise<MCPResponse> {
  const response = await fetch("http://localhost:8000/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw errorData;
  }

  return response.json();
}
