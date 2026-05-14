import os
import json
import uuid
import tiktoken
from crewai_tools import SerperDevTool
from datetime import datetime
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from database.db import insert_campaign_execution

def run_marketing_campaign(payload):

    load_dotenv()

    config = payload
    
    campaign_name = config["campaign_name"]
    target_audience = config["target_audience"]
    campaign_goal = config["campaign_goal"]
    topic = config["topic"]
    tone = config["tone"]
    company_name = config["company_name"]
    call_to_action = config["call_to_action"]
    governance_mode = config["governance_mode"]
    model_name = config["model_name"]
    input_cost_per_1m_tokens = config["input_cost_per_1m_tokens"]
    output_cost_per_1m_tokens = config["output_cost_per_1m_tokens"]
    search_tool = SerperDevTool()
    def estimate_tokens(text, model="gpt-4o-mini"):
        encoding = tiktoken.encoding_for_model(model)
        return len(encoding.encode(text))

    def load_prompt(file_path):
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read()
        
    research_prompt_template = load_prompt("prompts/research_prompt.txt")
    drafting_prompt_template = load_prompt("prompts/drafting_prompt.txt")
    brand_prompt_template = load_prompt("prompts/brand_prompt.txt")
    review_prompt_template = load_prompt("prompts/review_prompt.txt")

    with open("research_artifacts/latest_research_brief.md", "r", encoding="utf-8") as file:
        shared_context = file.read()

    execution_id = str(uuid.uuid4())
    start_time = datetime.now().isoformat()
    status = "started"

    if not os.getenv("OPENAI_API_KEY"):
        raise ValueError("OPENAI_API_KEY not found. Please check your .env file.")

    research_agent = Agent(
        role="Enterprise Marketing Research Agent",
        goal="Research the topic and identify market context, audience pain points, and messaging themes.",
        backstory=(
            "You are an enterprise marketing research specialist. "
            "You help create executive-ready marketing content by identifying relevant business context, "
            "customer needs, market themes, and strategic positioning points."
        ),
        tools=[search_tool],
        verbose=True,
        llm=model_name
    )

    drafting_agent = Agent(
        role="Enterprise Content Drafting Agent",
        goal="Create a clear and structured first draft based on the research insights.",
        backstory=(
            "You are an enterprise content strategist. "
            "You convert research insights into business-ready marketing drafts for executive audiences."
        ),
        verbose=True,
        llm=model_name
    )

    brand_agent = Agent(
        role="Brand and Emotion Alignment Agent",
        goal="Improve the draft by aligning it with professional tone, brand consistency, and emotional relevance.",
        backstory=(
            "You are a brand and messaging expert. "
            "You ensure the content feels credible, emotionally engaging, enterprise-ready, and aligned with a strategic transformation brand."
        ),
        verbose=True,
        llm=model_name
    )

    review_agent = Agent(
        role="Human Review Preparation Agent",
        goal="Prepare the final content package for human review and approval.",
        backstory=(
            "You are a governance and review specialist. "
            "You prepare AI-generated content for human approval by summarizing assumptions, risks, edits, and review checkpoints."
        ),
        verbose=True,
        llm=model_name
    )

    research_task = Task(
    description=research_prompt_template.format(
        campaign_name=campaign_name,
        target_audience=target_audience,
        campaign_goal=campaign_goal,
        topic=topic,
        tone=tone
    )
    + f"\n\nPrevious Shared Context:\n{shared_context}",

        expected_output="A concise research brief with audience concerns, pain points, messaging themes, and positioning.",
        output_file="research_artifacts/latest_research_brief.md",
        agent=research_agent
    )

    drafting_task = Task(
        description=drafting_prompt_template.format(
        campaign_name=campaign_name,
        target_audience=target_audience,
        campaign_goal=campaign_goal,
        topic=topic,
        tone=tone,
        company_name=company_name,
        call_to_action=call_to_action
    ),
        expected_output="A structured first-draft marketing email.",
        agent=drafting_agent
    )

    brand_task = Task(
        description=brand_prompt_template.format(
        company_name=company_name,
        topic=topic,
        tone=tone,
        governance_mode=governance_mode
    ),
        expected_output="A polished branded version of the marketing email.",
        agent=brand_agent
    )

    review_task = Task(
        description=review_prompt_template.format(
        campaign_name=campaign_name,
        company_name=company_name,
        target_audience=target_audience,
        governance_mode=governance_mode,
        human_approval_required=config["human_approval_required"]
    ),
        expected_output="A final review-ready content package.",
        agent=review_agent
    )

    crew = Crew(
        agents=[research_agent, drafting_agent, brand_agent, review_agent],
        tasks=[research_task, drafting_task, brand_task, review_task],
        process=Process.sequential,
        verbose=True
    )

    try:
        result = crew.kickoff()

        input_text = json.dumps(config)
        estimated_input_tokens = estimate_tokens(input_text, model_name)

        output_text = str(result)
        estimated_output_tokens = estimate_tokens(output_text, model_name)

        estimated_cost_usd = round(
            (estimated_input_tokens / 1_000_000 * input_cost_per_1m_tokens) +
            (estimated_output_tokens / 1_000_000 * output_cost_per_1m_tokens),
            6
        )

        output_folder = "sample-outputs/generated"
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f"{output_folder}/marketing_output_{timestamp}.md"
        json_output_file = f"{output_folder}/marketing_output_{timestamp}.json"

        with open(output_file, "w", encoding="utf-8") as file:
            file.write("# AI-Assisted Marketing Content Factory Output\n\n")
            file.write(output_text)

        structured_output = {
            "execution_metadata": {
                "execution_id": execution_id,
                "status": "completed",
                "approval_status": "pending_human_review",
                "start_time": start_time,
                "end_time": datetime.now().isoformat()
            },
            "campaign_context": {
                "campaign_name": campaign_name,
                "company_name": company_name,
                "target_audience": target_audience,
                "topic": topic,
                "governance_mode": governance_mode,
                "human_approval_required": config["human_approval_required"]
            },
            "final_output": {
                "content": output_text
            },
            "usage_metrics": {
                "model_name": model_name,
                "estimated_input_tokens": estimated_input_tokens,
                "estimated_output_tokens": estimated_output_tokens,
                "estimated_cost_usd": estimated_cost_usd
            },
            "artifact_paths": {
                "markdown_output": output_file,
                "json_output": json_output_file,
                "research_brief": "research_artifacts/latest_research_brief.md"
            }
        }

        with open(json_output_file, "w", encoding="utf-8") as file:
            json.dump(structured_output, file, indent=4)

        log_record = {
            "execution_id": execution_id,
            "campaign_name": campaign_name,
            "company_name": company_name,
            "target_audience": target_audience,
            "topic": topic,
            "model_name": model_name,
            "estimated_input_tokens": estimated_input_tokens,
            "estimated_output_tokens": estimated_output_tokens,
            "estimated_cost_usd": estimated_cost_usd,
            "governance_mode": governance_mode,
            "human_approval_required": config["human_approval_required"],
            "approval_status": "pending_human_review",
            "status": "completed",
            "start_time": start_time,
            "end_time": structured_output["execution_metadata"]["end_time"],
            "output_file": output_file,
            "json_output_file": json_output_file
        }

    except Exception as error:
        log_record = {
            "execution_id": execution_id,
            "campaign_name": campaign_name,
            "company_name": company_name,
            "target_audience": target_audience,
            "topic": topic,
            "model_name": model_name,
            "governance_mode": governance_mode,
            "status": "failed",
            "start_time": start_time,
            "end_time": datetime.now().isoformat(),
            "error": str(error)
        }

        structured_output = {
            "execution_metadata": log_record,
            "error": str(error)
        }

    log_file = "logs/execution_logs.json"

    with open(log_file, "r", encoding="utf-8") as file:
        logs = json.load(file)

    logs.append(log_record)

    with open(log_file, "w", encoding="utf-8") as file:
        json.dump(logs, file, indent=4)

    try:
        insert_campaign_execution(log_record)
    except Exception as db_error:
        print(f"Database logging failed, continuing without blocking response: {db_error}")

    return structured_output