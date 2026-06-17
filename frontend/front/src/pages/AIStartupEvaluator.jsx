import { useState } from "react";
import axios from "axios";

function AIStartupEvaluator() {
    const [formData, setFormData] = useState({
        idea: "",
        problem: "",
        users: "",
        industry: ""
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        try {
            // Call your actual backend API!
            const response = await axios.post("http://localhost:5000/api/ai/evaluate", formData);
            setResult(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to connect to the AI. Make sure your backend is running!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid bg-light min-vh-100 py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm border-0 p-4 p-md-5 mb-4">
                        
                        <h2 className="fw-bold mb-2">🤖 AI Startup Evaluator</h2>
                        <p className="text-muted mb-4">Evaluate your startup idea using artificial intelligence</p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Startup Idea</label>
                                <textarea name="idea" value={formData.idea} onChange={handleChange} className="form-control" rows="2" required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Problem Statement</label>
                                <textarea name="problem" value={formData.problem} onChange={handleChange} className="form-control" rows="2" required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Target Users</label>
                                <input type="text" name="users" value={formData.users} onChange={handleChange} className="form-control" required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-bold">Industry</label>
                                <input type="text" name="industry" value={formData.industry} onChange={handleChange} className="form-control" required />
                            </div>

                            <button type="submit" className="btn btn-dark btn-lg w-100" disabled={loading}>
                                {loading ? "Evaluating with Gemini AI..." : "Evaluate Startup 🚀"}
                            </button>
                        </form>
                    </div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div className="alert alert-danger text-center">
                            {error}
                        </div>
                    )}

                    {/* AI RESULTS CARD */}
                    {result && (
                        <div className="card shadow border-0 p-4 mt-4 bg-white">
                            <h3 className="fw-bold text-success mb-4">✨ AI Evaluation Complete</h3>
                            
                            <div className="row mb-4 text-center">
                                <div className="col-4">
                                    <h1 className="text-primary fw-bold">{result.innovation}%</h1>
                                    <p className="text-muted fw-bold">Innovation</p>
                                </div>
                                <div className="col-4">
                                    <h1 className="text-success fw-bold">{result.market}%</h1>
                                    <p className="text-muted fw-bold">Market Potential</p>
                                </div>
                                <div className="col-4">
                                    <h1 className="text-warning fw-bold">{result.feasibility}%</h1>
                                    <p className="text-muted fw-bold">Feasibility</p>
                                </div>
                            </div>

                            <h5 className="fw-bold border-bottom pb-2">Actionable Suggestions</h5>
                            <ul className="list-group list-group-flush">
                                {result.suggestions?.map((suggestion, index) => (
                                    <li key={index} className="list-group-item bg-transparent">
                                        💡 {suggestion}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default AIStartupEvaluator;