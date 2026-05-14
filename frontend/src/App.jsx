import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
  company_name: "ascAInd",
  campaign_name: "Enterprise AI Transformation Campaign",
  campaign_goal: "Promote enterprise AI transformation advisory services",
  target_audience: "CIOs and enterprise technology leaders",
  topic: "Enterprise AI Transformation",
  tone: "Executive and strategic",
  call_to_action: "Schedule a transformation strategy discussion",
  governance_mode: "strict",
  human_approval_required: true,
  model_name: "gpt-4o-mini",
  input_cost_per_1m_tokens: 0.15,
  output_cost_per_1m_tokens: 0.60,
});

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const runCampaign = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/run-marketing-campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        status: "error",
        message: "Unable to connect to backend API. Please ensure FastAPI is running.",
        details: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <div className="brand">asc<span>AI</span>nd</div>
          <div className="tagline">Enterprise Transformation</div>
        </div>
        <div className="badge">Enterprise AI Agent Factory</div>
      </header>

      <main className="layout">
        <section className="panel">
          <h1>AI Marketing Campaign Generator</h1>
          <p className="subtitle">
            Governance-aware enterprise AI workflow powered by FastAPI, CrewAI,
            OpenAI, Serper, PostgreSQL, and human approval lifecycle.
          </p>

          <div className="form-grid">
            <label>
              Company Name
              <input name="company_name" value={formData.company_name} onChange={handleChange} />
            </label>

            <label>
              Campaign Name
              <input name="campaign_name" value={formData.campaign_name} onChange={handleChange} />
            </label>

            <label>
              Target Audience
              <input name="target_audience" value={formData.target_audience} onChange={handleChange} />
            </label>

            <label>
              Topic
              <input name="topic" value={formData.topic} onChange={handleChange} />
            </label>

            <label>
              Tone
              <input name="tone" value={formData.tone} onChange={handleChange} />
            </label>

            <label>
              Governance Mode
              <select name="governance_mode" value={formData.governance_mode} onChange={handleChange}>
                <option value="strict">Strict</option>
                <option value="standard">Standard</option>
                <option value="advisory">Advisory</option>
              </select>
            </label>
          </div>

          <button onClick={runCampaign} disabled={loading}>
            {loading ? "Running Enterprise AI Workflow..." : "Run Campaign Workflow"}
          </button>
        </section>

        <section className="panel results">
          <h2>Execution Result</h2>

          {!result && (
            <div className="empty">
              Run the workflow to view execution metadata, governance status,
              generated output, and approval lifecycle.
            </div>
          )}

          {result && (
            <div className="result-box">
              <div className="status-row">
                <span>Status</span>
                <strong>{result.status || "completed"}</strong>
              </div>

              {result.execution_id && (
                <div className="status-row">
                  <span>Execution ID</span>
                  <strong>{result.execution_id}</strong>
                </div>
              )}

              {result.approval_status && (
                <div className="status-row">
                  <span>Approval Status</span>
                  <strong>{result.approval_status}</strong>
                </div>
              )}

              {result.estimated_cost_usd && (
                <div className="status-row">
                  <span>Estimated Cost</span>
                  <strong>${result.estimated_cost_usd}</strong>
                </div>
              )}

              <h3>Generated Output</h3>
              <pre>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;