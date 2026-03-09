"""
MCP Worker — Runs the full MCP pipeline in an isolated process.

This script is called by client_bridge.py as a subprocess.
It receives a user query as argv[1], performs the full MCP pipeline,
and prints a JSON response to stdout.

All print() for logging goes to stderr so stdout stays clean for JSON.
"""
import asyncio
import json
import os
import sys
import datetime

from mcp import ClientSession
from mcp.client.stdio import stdio_client, StdioServerParameters


def log(msg):
    """Log to stderr so stdout stays clean for JSON output."""
    print(msg, file=sys.stderr)


def get_context() -> dict:
    return {
        "timestamp": datetime.datetime.now().isoformat(),
        "user_session": "demo-user-123",
        "environment": "academic-demonstration",
        "platform": "windows",
        "system_status": "ready"
    }


def decide_tool(query: str, tool_names: list) -> tuple:
    """Model Layer: Decide which tool to use based on the query."""
    q = query.lower()
    if "gpa" in q or "calculate" in q or "grade" in q:
        return "calculate_gpa", {"grades": ["A", "B", "A"]}
    elif "exam" in q or "schedule" in q or "when" in q:
        return "check_exam_schedule", {"course_code": "AI407"}
    return "none", {}


async def run_pipeline(user_query: str) -> dict:
    context = get_context()
    log("Context loaded")

    server_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "server.py"))
    
    server_params = StdioServerParameters(
        command=sys.executable,
        args=["-u", server_path],
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            # Discovery
            list_result = await session.list_tools()
            tools = getattr(list_result, 'tools', [])
            tool_names = [t.name for t in tools]
            log(f"Tools discovered: {tool_names}")
            
            # Model decision
            selected_tool, parameters = decide_tool(user_query, tool_names)
            log(f"Model selected tool: {selected_tool}")
            
            result = {"message": "No matching tool found for this query."}
            
            if selected_tool != "none" and selected_tool in tool_names:
                log(f"Executing tool '{selected_tool}' via MCP")
                call_result = await session.call_tool(selected_tool, arguments=parameters)
                
                if hasattr(call_result, 'content') and call_result.content:
                    result = {"text": call_result.content[0].text}
                else:
                    result = {"raw": str(call_result)}
            
            log("Returning response to frontend")
            
            return {
                "context": context,
                "tools": tool_names,
                "selected_tool": selected_tool,
                "parameters": parameters,
                "result": result
            }


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No query provided"}))
        sys.exit(1)
    
    query = sys.argv[1]
    
    try:
        response = asyncio.run(run_pipeline(query))
        # Print ONLY the JSON to stdout
        print(json.dumps(response))
    except Exception as e:
        log(f"Pipeline error: {e}")
        context = get_context()
        print(json.dumps({
            "context": context,
            "tools": [],
            "selected_tool": "error",
            "parameters": {},
            "result": {"error": str(e)}
        }))


if __name__ == "__main__":
    main()
