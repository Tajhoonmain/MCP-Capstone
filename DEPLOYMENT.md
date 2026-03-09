# 🚀 Deploy MCP Capstone Project on Render

This guide will help you deploy your enhanced MCP Academic Assistant to Render.com.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Render CLI**: Install Render CLI (optional but recommended)

## 🗂️ Files Created for Deployment

### Core Configuration Files:
- `render.yaml` - Render service configuration
- `Dockerfile` - Container configuration
- `.dockerignore` - Files to exclude from Docker build
- `requirements.txt` - Python dependencies
- `api_production.py` - Production-ready Flask app

## 🚀 Deployment Steps

### Method 1: Via Render Dashboard (Recommended)

1. **Connect GitHub to Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select the `MCP-Capstone` repository
   - Choose the branch: `master`

2. **Configure Service**
   - **Name**: `mcp-academic-api`
   - **Region**: Choose closest to your users
   - **Branch**: `master`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && python api_production.py`
   - **Start Command**: `python api_production.py`
   - **Instance Type**: `Free` (or upgrade as needed)

3. **Environment Variables**
   Set these in Render Dashboard:
   ```
   FLASK_ENV=production
   FLASK_DEBUG=false
   SECRET_KEY=your-secure-secret-key-here
   MAX_RETRIES=3
   RETRY_DELAY=1.0
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-5 minutes)

### Method 2: Via Render CLI

1. **Install Render CLI**
   ```bash
   npm install -g @render/cli
   ```

2. **Login to Render**
   ```bash
   render login
   ```

3. **Deploy**
   ```bash
   render.yaml
   ```

## 🔧 Configuration Details

### Service Configuration
- **Primary Service**: Flask API (`api_production.py`)
- **Internal Service**: MCP Server (for internal communication)
- **Health Check**: `/health` endpoint with 30s timeout
- **Auto-Deploy**: Enabled on git push

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `FLASK_ENV` | `production` | Environment mode |
| `FLASK_DEBUG` | `false` | Debug mode |
| `SECRET_KEY` | Auto-generated | Flask session key |
| `MAX_RETRIES` | `3` | API retry attempts |
| `RETRY_DELAY` | `1.0` | Retry delay in seconds |
| `PORT` | `8000` | Application port |

## 🌐 Accessing Your Deployed Application

### Primary URL
Once deployed, your app will be available at:
```
https://mcp-academic-api.onrender.com
```

### API Endpoints
- **POST** `/ask` - Execute MCP queries
- **POST** `/batch` - Batch query processing
- **GET** `/health` - System health check
- **GET** `/session` - Session management
- **DELETE** `/session` - Clear session
- **GET** `/sessions` - List sessions (admin)

### Health Check
```bash
curl https://mcp-academic-api.onrender.com/health
```

## 🎯 Frontend Deployment

### Option 1: Render Static Site
1. Create `frontend/render.yaml`:
   ```yaml
   services:
     - type: web
       name: mcp-frontend
       runtime: node
       buildCommand: npm install && npm run build
       publishPath: frontend/dist
       staticPublishPath: frontend/dist
   ```

2. Deploy frontend separately to get a URL like:
   ```
   https://mcp-frontend.onrender.com
   ```

### Option 2: Update Frontend API URL
Update `frontend/src/services/api.ts`:
```typescript
export async function runQuery(query: string): Promise<MCPResponse> {
  const response = await fetch("https://mcp-academic-api.onrender.com/ask", {
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
```

## 🔍 Testing Your Deployment

### 1. Health Check
```bash
curl https://mcp-academic-api.onrender.com/health
```

### 2. API Test
```bash
curl -X POST https://mcp-academic-api.onrender.com/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "calculate my gpa", "user_id": "test_user"}'
```

### 3. Batch Test
```bash
curl -X POST https://mcp-academic-api.onrender.com/batch \
  -H "Content-Type: application/json" \
  -d '{
    "queries": [
      {"id": "q1", "query": "calculate my gpa"},
      {"id": "q2", "query": "when is my exam"}
    ],
    "user_id": "batch_test"
  }'
```

## 📊 Monitoring

### Render Dashboard
- **Logs**: View real-time logs
- **Metrics**: Monitor performance
- **Alerts**: Set up error notifications
- **Health Checks**: Automatic health monitoring

### Custom Domain (Optional)
1. Go to Render Dashboard
2. Select your service
3. Go to "Custom Domains"
4. Add your domain (e.g., `mcp.yourdomain.com`)
5. Update DNS records as instructed

## 🔒 Security Considerations

### Production Security
1. **Update SECRET_KEY**: Use a strong, unique secret
2. **HTTPS**: Render provides automatic SSL
3. **Rate Limiting**: Consider implementing rate limiting
4. **Input Validation**: Sanitize all user inputs
5. **Session Security**: Use secure session configuration

### Environment Variables Security
- Never commit secrets to Git
- Use Render's environment variable management
- Rotate secrets regularly
- Use different keys for development/production

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
- Check `requirements.txt` format
- Verify Python version compatibility
- Review Docker build logs

#### 2. Runtime Errors
- Check Render logs in dashboard
- Verify environment variables
- Test health endpoint

#### 3. CORS Issues
- Update CORS origins in production
- Verify frontend URL configuration
- Check pre-flight requests

#### 4. MCP Server Issues
- Check subprocess logs
- Verify MCP worker script path
- Test MCP server independently

### Debug Mode
Enable debug logging:
```bash
# In Render dashboard
FLASK_DEBUG=true
```

## 📈 Scaling

### Free Tier Limitations
- **CPU**: Limited shared CPU
- **Memory**: 512MB RAM
- **Bandwidth**: 100GB/month
- **Build Time**: 15 minutes

### Upgrade Options
- **Starter**: More CPU, 1GB RAM
- **Standard**: Even more resources
- **Plus**: Production-level resources

## 🔄 CI/CD Pipeline

### Automatic Deployments
Render automatically deploys when you:
1. Push to `master` branch
2. Update environment variables
3. Manual trigger from dashboard

### Build Process
1. Install dependencies from `requirements.txt`
2. Copy application files
3. Start Flask application on port 8000
4. Health check verification
5. Route traffic to your service

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Flask Deployment Guide](https://flask.palletsprojects.com/en/latest/deploying/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [MCP Protocol](https://modelcontextprotocol.io/)

## 🎉 Success Checklist

After deployment, verify:

- [ ] Health check returns `200 OK`
- [ ] API endpoints respond correctly
- [ ] Frontend can connect to backend
- [ ] Logs show no critical errors
- [ ] Environment variables are set
- [ ] HTTPS is working
- [ ] Custom domain (if configured)

Your MCP Academic Assistant is now live on Render! 🚀
