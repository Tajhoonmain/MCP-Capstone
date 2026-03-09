# MCP Capstone Project

A complete Model Context Protocol (MCP) demonstration system that showcases the integration between a React frontend and MCP server architecture.

## 🏗️ Architecture

```
React Frontend → Flask API Bridge → MCP Client → MCP Server → Tools
```

### Layers Implemented:

- **Model Layer**: Tool selection logic based on user queries
- **Context Layer**: System context management (session, environment, timestamps)
- **Tool Layer**: MCP protocol-based tool discovery and execution
- **Execution Layer**: Actual tool implementation (GPA calculation, exam scheduling)

## 📁 Project Structure

```
capstone-lab mid/
├── frontend/                    # React + Tailwind UI
│   ├── src/
│   │   ├── components/          # UI components
│   │   ├── pages/              # Dashboard page
│   │   └── services/          # API service layer
│   └── package.json
├── mcp_project/                # MCP Implementation
│   ├── mcp_server/            # MCP server components
│   ├── client/                 # MCP client layer
│   ├── model/                  # Model layer (tool selection)
│   ├── execution/              # Tool execution layer
│   ├── server.py              # MCP server
│   ├── client_bridge.py       # MCP client bridge
│   └── _mcp_worker.py        # MCP pipeline worker
├── api_flask.py               # Flask API bridge
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tajhoonmain/MCP-Capstone.git
   cd MCP-Capstone
   ```

2. **Install Python dependencies**
   ```bash
   pip install mcp fastapi flask flask-cors uvicorn
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Running the System

**Step 1: Start MCP Server**
```bash
cd mcp_project
python server.py
```

**Step 2: Start Flask Backend**
```bash
cd ..
python api_flask.py
```

**Step 3: Start React Frontend**
```bash
cd frontend
npm run dev
```

### Access Points

- **Frontend**: http://localhost:5173 (or 5174 if 5173 is busy)
- **Backend API**: http://localhost:8000
- **API Endpoint**: POST http://localhost:8000/ask

## 🔧 Available Tools

### 1. GPA Calculator
- **Tool Name**: `calculate_gpa`
- **Description**: Calculate GPA from letter grades
- **Sample Query**: "calculate my gpa"
- **Parameters**: `{"grades": ["A", "B", "A"]}`
- **Result**: `{"text": "Calculated GPA: 3.67"}`

### 2. Exam Schedule Checker
- **Tool Name**: `check_exam_schedule`
- **Description**: Get exam schedule for a course
- **Sample Query**: "when is my exam"
- **Parameters**: `{"course_code": "AI407"}`
- **Result**: `{"text": "Exam for AI407: Monday 2:00 PM"}`

## 📊 API Response Format

The system returns responses in the MCPResponse format:

```json
{
  "context": {
    "timestamp": "2026-03-09T05:08:47.644482",
    "user_session": "demo-user-123",
    "environment": "academic-demonstration",
    "platform": "windows",
    "system_status": "ready"
  },
  "tools": ["calculate_gpa", "check_exam_schedule"],
  "selected_tool": "calculate_gpa",
  "parameters": {
    "grades": ["A", "B", "A"]
  },
  "result": {
    "text": "Calculated GPA: 3.67"
  }
}
```

## 🔄 Pipeline Flow

1. **User Query** - React frontend sends query to Flask API
2. **Context Loading** - System loads session context
3. **Tool Discovery** - MCP client discovers available tools
4. **Model Selection** - Model layer selects appropriate tool
5. **MCP Execution** - Tool executed via MCP protocol
6. **Response Return** - Structured response returned to frontend

## 📝 Logging

The system provides comprehensive logging at each pipeline step:

```
Context loaded
Tools discovered: ['calculate_gpa', 'check_exam_schedule']
Model selected tool: calculate_gpa
Executing tool via MCP
Returning response to frontend
```

## 🎯 Sample Queries to Test

- "calculate my gpa"
- "what's my gpa"
- "check my grades"
- "when is my exam"
- "exam schedule"
- "check exam for AI407"

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Flask, Flask-CORS
- **MCP**: Model Context Protocol (mcp library)
- **UI Components**: Radix UI, Lucide Icons
- **Build Tools**: Vite, npm

## 📚 MCP Architecture Demonstration

This project demonstrates:

- ✅ **MCP Protocol Compliance**: All tool execution through MCP
- ✅ **Layer Separation**: Clear separation between model, context, tool, and execution layers
- ✅ **Tool Discovery**: Dynamic tool discovery via MCP
- ✅ **Structured Responses**: Consistent MCPResponse format
- ✅ **Logging Pipeline**: Complete visibility into MCP flow
- ✅ **Academic Use Case**: University assistant scenario

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is for academic demonstration purposes as part of a capstone project.

## 🔗 Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [MCP Python Library](https://github.com/modelcontextprotocol/python-sdk)
- [React Documentation](https://react.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
