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
    human_approval_required: true,
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
        message: "Unable to connect to backend API.",
        details: error.message,
      });
    }

    setLoading(false);
  };

  const content = result?.final_output?.content || "";
  const metadata = result?.execution_metadata || {};
  const campaign = result?.campaign_context || {};
  const usage = result?.usage_metrics || {};

  const getSection = (start, end) => {
    if (!content) return "";
    const startIndex = content.indexOf(start);
    if (startIndex === -1) return "";
    const sliced = content.slice(startIndex + start.length);
    if (!end) return sliced.trim();
    const endIndex = sliced.indexOf(end);
    return (endIndex === -1 ? sliced : sliced.slice(0, endIndex)).trim();
  };

  const emailDraft = getSection("### 1. Final Email Draft", "### 2.");
  const assumptions = getSection("### 2. Key Assumptions", "### 3.");
  const risks = getSection("### 3. Risks or Claims to Verify", "### 4.");
  const checklist = getSection("### 4. Human Approval Checklist", "### 5.");

  return (
    <div
      style={{
        backgroundColor: "#f3f6f9",
        minHeight: "100vh",
        padding: "32px 48px",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            backgroundColor: "#125486",
            padding: "22px 36px",
            borderRadius: "14px",
            marginBottom: "34px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 8px 22px rgba(15, 76, 129, 0.22)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "48px",
                lineHeight: "42px",
                fontWeight: 800,
                letterSpacing: "-2px",
                color: "#050505",
              }}
            >
              asc<span style={{ color: "#6ec1ff" }}>AI</span>nd
            </div>
            <div
              style={{
                color: "white",
                fontSize: "20px",
                marginTop: "2px",
                letterSpacing: "-0.5px",
              }}
            >
              Enterprise Transformation
            </div>
          </div>

          <div
            style={{
              color: "white",
              border: "1px solid rgba(255,255,255,0.35)",
              padding: "15px 28px",
              borderRadius: "999px",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Enterprise AI Agent Factory
          </div>
        </header>

        <main
          style={{
            display: "grid",
            gridTemplateColumns: "430px 1fr",
            gap: "34px",
            alignItems: "start",
          }}
        >
          <section
            style={{
              backgroundColor: "white",
              padding: "34px",
              borderRadius: "24px",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
            }}
          >
            <h1
              style={{
                textAlign: "center",
                fontSize: "31px",
                lineHeight: "36px",
                margin: "0 0 14px",
              }}
            >
              AI Marketing Campaign Generator
            </h1>

            <p
              style={{
                textAlign: "center",
                color: "#334155",
                lineHeight: "1.65",
                fontSize: "18px",
                marginBottom: "30px",
              }}
            >
              Governance-aware enterprise AI workflow powered by FastAPI,
              CrewAI, OpenAI, Serper, PostgreSQL, and human approval lifecycle.
            </p>

            {visibleFields.map((key) => (
              <div key={key} style={{ marginBottom: "18px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 700,
                    fontSize: "15px",
                    color: "#334155",
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
                      padding: "14px",
                      borderRadius: "12px",
                      border: "1px solid #cbd5e1",
                      fontSize: "15px",
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
                      padding: "14px",
                      borderRadius: "12px",
                      border: "1px solid #cbd5e1",
                      fontSize: "15px",
                      boxSizing: "border-box",
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
                marginTop: "8px",
                padding: "17px",
                borderRadius: "14px",
                border: "none",
                backgroundColor: loading ? "#94a3b8" : "#125486",
                color: "white",
                fontSize: "18px",
                fontWeight: 800,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading
                ? "Running Enterprise AI Workflow..."
                : "Run Campaign Workflow"}
            </button>
          </section>

          <section
            style={{
              backgroundColor: "white",
              padding: "34px",
              borderRadius: "24px",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
              minHeight: "760px",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                fontSize: "30px",
                marginTop: 0,
                marginBottom: "28px",
              }}
            >
              Marketing Review Package
            </h2>

            {!result && (
              <div
                style={{
                  textAlign: "center",
                  color: "#64748b",
                  border: "2px dashed #cbd5e1",
                  padding: "70px",
                  borderRadius: "20px",
                  fontSize: "18px",
                  lineHeight: "1.7",
                }}
              >
                Run the workflow to generate a campaign draft, governance review,
                approval checklist, and execution metrics.
              </div>
            )}

            {result?.status === "error" && (
              <div
                style={{
                  backgroundColor: "#fff1f2",
                  border: "1px solid #fecdd3",
                  padding: "24px",
                  borderRadius: "16px",
                  color: "#9f1239",
                }}
              >
                <h3>Error</h3>
                <p>{result.message}</p>
                <pre style={{ whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </div>
            )}

            {result && result.status !== "error" && (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "18px",
                    marginBottom: "28px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#ecfdf5",
                      border: "1px solid #bbf7d0",
                      padding: "18px",
                      borderRadius: "16px",
                    }}
                  >
                    <div style={{ color: "#166534", fontWeight: 800 }}>
                      Status
                    </div>
                    <div style={{ fontSize: "20px", marginTop: "6px" }}>
                      Content Ready for Human Review
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#fffbeb",
                      border: "1px solid #fde68a",
                      padding: "18px",
                      borderRadius: "16px",
                    }}
                  >
                    <div style={{ color: "#92400e", fontWeight: 800 }}>
                      Approval
                    </div>
                    <div style={{ fontSize: "20px", marginTop: "6px" }}>
                      Pending
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#92400e",
                        marginTop: "8px",
                        lineHeight: "1.5",
                      }}
                    >
                      Once extended, approval can move the output to an email
                      client, CRM, campaign system, or publishing workflow.
                    </div>
                  </div>
                </div>

                <Box title="Campaign Summary">
                  <Info label="Campaign Name" value={campaign.campaign_name} />
                  <Info label="Company" value={campaign.company_name} />
                  <Info label="Target Audience" value={campaign.target_audience} />
                  <Info label="Topic" value={campaign.topic} />
                  <Info label="Governance Mode" value={campaign.governance_mode} />
                </Box>

                <Box title="Generated Email Draft">
                  <FormattedText text={emailDraft || content} />
                </Box>

                <Box title="Governance & Risk Review">
                  <FormattedText text={risks || "No explicit risks returned."} />
                </Box>

                <Box title="Human Approval Checklist">
                  <FormattedText
                    text={checklist || "Review generated content before use."}
                  />
                </Box>

                <Box title="Key Assumptions">
                  <FormattedText
                    text={assumptions || "No assumptions returned."}
                  />
                </Box>

                <Box title="Execution Metrics">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "14px",
                    }}
                  >
                    <Metric label="Model" value={usage.model_name} />
                    <Metric
                      label="Input Tokens"
                      value={usage.estimated_input_tokens}
                    />
                    <Metric
                      label="Output Tokens"
                      value={usage.estimated_output_tokens}
                    />
                    <Metric
                      label="Estimated Cost"
                      value={
                        usage.estimated_cost_usd
                          ? `$${usage.estimated_cost_usd}`
                          : ""
                      }
                    />
                  </div>

                  <div style={{ marginTop: "16px", fontSize: "13px" }}>
                    <strong>Execution ID:</strong> {metadata.execution_id}
                  </div>
                </Box>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function Box({ title, children }) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "22px",
        marginBottom: "22px",
        backgroundColor: "#ffffff",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: "16px",
          fontSize: "22px",
          color: "#0f172a",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={{ marginBottom: "10px", lineHeight: "1.5" }}>
      <strong>{label}:</strong> {value || "—"}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        padding: "14px",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
      }}
    >
      <div style={{ color: "#64748b", fontSize: "13px", fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ fontSize: "17px", fontWeight: 800, marginTop: "6px" }}>
        {value || "—"}
      </div>
    </div>
  );
}

function FormattedText({ text }) {
  return (
    <div
      style={{
        whiteSpace: "pre-wrap",
        lineHeight: "1.7",
        color: "#1e293b",
        fontSize: "16px",
      }}
    >
      {text
        .replaceAll("**", "")
        .replaceAll("---", "")
        .replaceAll("###", "")
        .trim()}
    </div>
  );
}

export default App;