# Enterprise AI Agent Factory

Governance-aware multi-agent AI workflow for marketing campaign generation using React, FastAPI, CrewAI, OpenAI, PostgreSQL, Vercel, and Render.

This solution enables business users to generate AI-assisted marketing campaign review packages through a governed enterprise workflow.

---

# Prerequisites

Install the following before setup:

- Python 3.11+
- Node.js 18+
- Git
- PostgreSQL
- VS Code (recommended)

Required Accounts:

- OpenAI
- SERPER
- GitHub
- Render
- Vercel

---

# Clone Repository

```powershell
git clone <YOUR_GITHUB_REPO_URL>
cd enterprise-ai-agent-factory
```

---

# Backend Setup

Create virtual environment:

```powershell
python -m venv .venv
```

Activate environment:

```powershell
.\.venv\Scripts\activate
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

---

# Frontend Setup

Move to frontend directory:

```powershell
cd frontend
```

Install frontend packages:

```powershell
npm install
```

Return to root folder:

```powershell
cd ..
```

---

# Environment Configuration

Copy example environment file:

```powershell
copy .env.example .env
```

Update `.env` with your values.

Required variables:

```env
OPENAI_API_KEY=
SERPER_API_KEY=
DATABASE_URL=
VITE_API_BASE_URL=

OTEL_SDK_DISABLED=true
CREWAI_DISABLE_TELEMETRY=true
```

Important:

- `.env` should NEVER be pushed to GitHub
- `.env.example` CAN be pushed
- Keep all secrets inside `.env`

---

# Start Backend

```powershell
uvicorn api.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger API Docs:

```text
http://127.0.0.1:8000/docs
```

---

# Start Frontend

Open a new terminal:

```powershell
cd frontend
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# Local Testing

Open frontend URL.

Enter campaign details:

- Company Name
- Campaign Name
- Campaign Goal
- Target Audience
- Topic
- Tone
- Call To Action

Run workflow.

Expected Output:

- Content Ready for Human Review
- Approval Status
- Campaign Summary
- Generated Email
- Governance & Risk Review
- Human Approval Checklist
- Execution Metrics

---

# Render Deployment Backend

Create new Web Service in Render.

Connect GitHub repository.

Build Command:

```text
pip install -r requirements.txt
```

Start Command:

```text
uvicorn api.main:app --host 0.0.0.0 --port 10000
```

Add Render Environment Variables:

```env
OPENAI_API_KEY=
SERPER_API_KEY=
DATABASE_URL=

OTEL_SDK_DISABLED=true
CREWAI_DISABLE_TELEMETRY=true
```

After deployment verify:

```text
https://YOUR-RENDER-URL.onrender.com/docs
```

---

# Vercel Deployment Frontend

Import GitHub repository into Vercel.

Configuration:

- Root Directory = frontend
- Framework = Vite

Add Vercel Environment Variable:

```env
VITE_API_BASE_URL=https://YOUR-RENDER-URL.onrender.com
```

Redeploy after saving variables.

---

# Updating the Solution

After code changes:

```powershell
git add .
git commit -m "Your update message"
git push
```

Render and Vercel will auto-deploy.

---

# Important Security Notes

- Never hardcode API keys
- Never push `.env`
- Keep secrets only in environment variables
- Use Render/Vercel environment variable management
- Disable telemetry using:

```env
OTEL_SDK_DISABLED=true
CREWAI_DISABLE_TELEMETRY=true
```

---

# Common Troubleshooting

## Frontend cannot connect to backend

Verify:

```env
VITE_API_BASE_URL
```

is correct in Vercel.

Then redeploy frontend.

---

## 500 Internal Server Error

Check Render logs.

Common reasons:

- Missing environment variables
- Missing API keys
- Invalid database connection
- Missing runtime artifacts

---

## Module Not Found

Reinstall dependencies:

```powershell
pip install -r requirements.txt
npm install
```

---

# Future Enhancements

Potential enterprise extensions:

- Human approval workflow buttons
- Email integration
- Campaign publishing integration
- RBAC access control
- Dashboarding and analytics
- Multi-user approvals
- Enterprise observability
- SIEM integration
- CRM integration