"""
Flask Bridge — Connects React Frontend to MCP Pipeline.

Architecture: React → Flask → subprocess(_mcp_worker.py) → MCP Server → Tools
"""
import sys
import os
import json
import subprocess
import traceback
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:5174"])  # Enable CORS for frontend ports

# Path to the MCP worker script
MCP_WORKER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "mcp_project", "_mcp_worker.py")


def _get_context():
    return {
        "timestamp": datetime.datetime.now().isoformat(),
        "user_session": "demo-user-123",
        "environment": "academic-demonstration",
        "platform": "windows",
        "system_status": "ready"
    }


def run_mcp_pipeline(query: str) -> dict:
    """Runs the MCP pipeline in a clean subprocess."""
    try:
        result = subprocess.run(
            [sys.executable, MCP_WORKER, query],
            capture_output=True,
            text=True,
            timeout=30,
            cwd=os.path.join(os.path.dirname(os.path.abspath(__file__)), "mcp_project")
        )
        
        if result.returncode != 0:
            print(f"[Bridge] Worker stderr: {result.stderr}")
            return {
                "context": _get_context(),
                "tools": [],
                "selected_tool": "error",
                "parameters": {},
                "result": {"error": result.stderr.strip() or "Worker process failed"}
            }
        
        return json.loads(result.stdout)
        
    except subprocess.TimeoutExpired:
        return {
            "context": _get_context(),
            "tools": [],
            "selected_tool": "error",
            "parameters": {},
            "result": {"error": "MCP pipeline timed out"}
        }
    except json.JSONDecodeError as e:
        return {
            "context": _get_context(),
            "tools": [],
            "selected_tool": "error",
            "parameters": {},
            "result": {"error": f"Invalid JSON from worker: {e}"}
        }


@app.route('/ask', methods=['POST'])
def ask():
    """
    Bridge endpoint: HTTP → MCP protocol.
    Tools are NEVER called directly — all execution goes through MCP.
    """
    data = request.get_json()
    query = data.get('query', '')
    
    print(f"\n{'='*50}")
    print(f"[API] Request received: '{query}'")
    print(f"{'='*50}")
    
    try:
        response_data = run_mcp_pipeline(query)
        
        print(f"[API] Returning response to frontend")
        print(f"[API] Selected tool: {response_data.get('selected_tool')}")
        print(f"[API] Result: {response_data.get('result')}")
        
        # Log the pipeline steps as required
        print(f"\n[Pipeline Summary]")
        print(f"- Context loaded: {bool(response_data.get('context'))}")
        print(f"- Tools discovered: {len(response_data.get('tools', []))}")
        print(f"- Model selected tool: {response_data.get('selected_tool')}")
        print(f"- Executing tool via MCP: {response_data.get('selected_tool') != 'none'}")
        print(f"- Returning response to frontend: Complete")
        
        return jsonify(response_data)
        
    except Exception as e:
        traceback.print_exc()
        print(f"[API] Error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/')
def root():
    return jsonify({"message": "MCP Academic Demo API is running"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
