from fastapi import FastAPI
from api.marketing_service import run_marketing_campaign
from database.db import update_approval_status

app = FastAPI(
    title="Enterprise AI Marketing Agent API",
    version="1.0.0"
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