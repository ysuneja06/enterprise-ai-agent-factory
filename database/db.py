import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()


def get_db_connection():
    connection = psycopg2.connect(
        host=os.getenv("POSTGRES_HOST"),
        port=os.getenv("POSTGRES_PORT"),
        database=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        cursor_factory=RealDictCursor
    )

    return connection


def insert_campaign_execution(log_record):
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