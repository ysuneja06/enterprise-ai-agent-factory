import { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function App() {
  const [formData, setFormData] = useState({
    company_name: "ascAInd",
    campaign_name: "Enterprise AI Transformation Campaign",
    campaign_goal: "Promote enterprise AI transformation advisory services",
    target_audience: "CIOs and enterprise technology leaders",
    topic: "Enterprise AI Transformation",
    tone: "Executive and strategic",
    call_to_action: "Schedule a transformation strategy discussion",
    governance_mode: "Strict",
    model_name: "gpt-4o-mini",
    input_cost_per_1m_tokens: 0.15,
    output_cost_per_1m_tokens: 0.6,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const visibleFields = [
    "company_name",
    "campaign_name",
    "campaign_goal",
    "target_audience",
    "topic",
    "tone",
    "call_to_action",
    "governance_mode",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const runWorkflow = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/run-marketing-campaign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({
          status: "error",
          message: "Backend returned an error.",
          details: data,
        });
      } else {
        setResult(data);
      }
    } catch (error) {
      setResult({
        status: "error",
        message:
          "Unable to connect to backend API. Please ensure FastAPI is running.",
        details: error.message,
      });
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          backgroundColor: "#0f4c81",
          color: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "44px", fontWeight: "bold" }}>
            asc<span style={{ color: "#6ec1ff" }}>AI</span>nd
          </h1>
          <p style={{ margin: 0 }}>Enterprise Transformation</p>
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.3)",
            padding: "12px 20px",
            borderRadius: "999px",
          }}
        >
          Enterprise AI Agent Factory
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "30px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
            AI Marketing Campaign Generator
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#374151",
              lineHeight: "1.8",
              marginBottom: "30px",
            }}
          >
            Governance-aware enterprise AI workflow powered by FastAPI, CrewAI,
            OpenAI, Serper, PostgreSQL, and human approval lifecycle.
          </p>

          {visibleFields.map((key) => (
            <div key={key} style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
              >
                {key.replaceAll("_", " ")}
              </label>

              {key === "governance_mode" ? (
                <select
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "13px",
                    borderRadius: "12px",
                    border: "1px solid #d1d5db",
                  }}
                >
                  <option value="Strict">Strict</option>
                  <option value="Balanced">Balanced</option>
                  <option value="Relaxed">Relaxed</option>
                </select>
              ) : (
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "13px",
                    borderRadius: "12px",
                    border: "1px solid #d1d5db",
                  }}
                />
              )}
            </div>
          ))}

          <button
            onClick={runWorkflow}
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              border: "none",
              backgroundColor: loading ? "#94a3b8" : "#0f4c81",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? "Running Enterprise AI Workflow..."
              : "Run Campaign Workflow"}
          </button>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
            Execution Result
          </h2>

          {result ? (
            <div>
              <div
                style={{
                  marginBottom: "20px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <strong>Status</strong>
                <div style={{ float: "right", fontWeight: "bold" }}>
                  {result.status || "completed"}
                </div>
              </div>

              {result.execution_id && (
                <div style={{ marginBottom: "12px" }}>
                  <strong>Execution ID:</strong> {result.execution_id}
                </div>
              )}

              {result.approval_status && (
                <div style={{ marginBottom: "12px" }}>
                  <strong>Approval Status:</strong> {result.approval_status}
                </div>
              )}

              {result.estimated_cost_usd && (
                <div style={{ marginBottom: "12px" }}>
                  <strong>Estimated Cost:</strong> ${result.estimated_cost_usd}
                </div>
              )}

              <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
                Generated Output
              </h3>

              <pre
                style={{
                  backgroundColor: "#06122e",
                  color: "white",
                  padding: "30px",
                  borderRadius: "20px",
                  overflowX: "auto",
                  lineHeight: "1.8",
                  whiteSpace: "pre-wrap",
                  maxHeight: "650px",
                }}
              >
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "#6b7280",
                border: "2px dashed #d1d5db",
                padding: "60px",
                borderRadius: "20px",
              }}
            >
              Run the workflow to view execution metadata, governance status,
              generated output, and approval lifecycle.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;