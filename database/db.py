import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()


def get_db_connection():
    database_url = os.getenv("DATABASE_URL")

    if database_url:
        return psycopg2.connect(
            database_url,
            cursor_factory=RealDictCursor,
            sslmode="require"
        )

    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST"),
        port=os.getenv("POSTGRES_PORT"),
        database=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        cursor_factory=RealDictCursor
    )


def initialize_database():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS campaign_executions (
            id SERIAL PRIMARY KEY,
            execution_id VARCHAR(255),
            campaign_name TEXT,
            company_name TEXT,
            target_audience TEXT,
            topic TEXT,
            model_name TEXT,
            estimated_input_tokens INTEGER,
            estimated_output_tokens INTEGER,
            estimated_cost_usd NUMERIC,
            governance_mode TEXT,
            human_approval_required BOOLEAN,
            approval_status TEXT,
            status TEXT,
            start_time TIMESTAMP,
            end_time TIMESTAMP,
            output_file TEXT,
            json_output_file TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    connection.commit()
    cursor.close()
    connection.close()


def insert_campaign_execution(log_record):
    initialize_database()

    connection = get_db_connection()
    cursor = connection.cursor()

    query = """
        INSERT INTO campaign_executions (
            execution_id,
            campaign_name,
            company_name,
            target_audience,
            topic,
            model_name,
            estimated_input_tokens,
            estimated_output_tokens,
            estimated_cost_usd,
            governance_mode,
            human_approval_required,
            approval_status,
            status,
            start_time,
            end_time,
            output_file,
            json_output_file
        )
        VALUES (
            %(execution_id)s,
            %(campaign_name)s,
            %(company_name)s,
            %(target_audience)s,
            %(topic)s,
            %(model_name)s,
            %(estimated_input_tokens)s,
            %(estimated_output_tokens)s,
            %(estimated_cost_usd)s,
            %(governance_mode)s,
            %(human_approval_required)s,
            %(approval_status)s,
            %(status)s,
            %(start_time)s,
            %(end_time)s,
            %(output_file)s,
            %(json_output_file)s
        )
    """

    cursor.execute(query, log_record)
    connection.commit()

    cursor.close()
    connection.close()


def update_approval_status(execution_id, approval_status):
    connection = get_db_connection()
    cursor = connection.cursor()

    query = """
        UPDATE campaign_executions
        SET approval_status = %s
        WHERE execution_id = %s
    """

    cursor.execute(query, (approval_status, execution_id))
    connection.commit()

    cursor.close()
    connection.close()