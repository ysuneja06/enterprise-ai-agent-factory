from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.marketing_service import run_marketing_campaign
from database.db import update_approval_status

app = FastAPI(
    title="Enterprise AI Marketing Agent API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://enterprise-ai-agent-factory.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Enterprise AI Marketing Agent API is running"
    }


@app.post("/run-marketing-campaign")
def run_campaign(payload: dict):
    result = run_marketing_campaign(payload)
    return result


@app.post("/update-approval-status")
def update_approval(payload: dict):
    execution_id = payload["execution_id"]
    approval_status = payload["approval_status"]

    update_approval_status(execution_id, approval_status)

    return {
        "message": "Approval status updated successfully",
        "execution_id": execution_id,
        "approval_status": approval_status
    }