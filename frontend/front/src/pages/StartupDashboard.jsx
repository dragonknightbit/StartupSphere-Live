import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../services/api";
import { io } from "socket.io-client";
import DashboardLayout from "../components/layout/DashboardLayout";

// Connect to your backend server
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5001", {
  autoConnect: false
});

function StartupDashboard() {
  // --- Form & API State ---
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    idea: "",
    problem: "",
    users: "",
    fundingRequired: ""
  });
  
  // NEW: State for the PDF file
  const [pitchDeck, setPitchDeck] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [myStartups, setMyStartups] = useState([]);

  // --- WebSocket Notifications State ---
  const [notifications, setNotifications] = useState([]);

  // --- Setup WebSocket ---
  useEffect(() => {
    socket.connect();
    socket.on("receiveNotification", (message) => {
      const newNotif = { id: Date.now(), text: message };
      setNotifications((prev) => [...prev, newNotif]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNotif.id));
      }, 5000);
    });

    fetchMyStartups();

    return () => {
      socket.off("receiveNotification");
      socket.disconnect();
    };
  }, []);

  const fetchMyStartups = async () => {
    try {
      const res = await API.get("/startups");
      const userId = localStorage.getItem("_id");
      const filtered = res.data.filter(s => s.founder && s.founder._id === userId);
      setMyStartups(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStartup = async (id) => {
    if (!window.confirm("Are you sure you want to delete this startup?")) return;
    try {
      await API.delete(`/startups/${id}`);
      fetchMyStartups();
    } catch (err) {
      console.error(err);
      alert("Failed to delete startup.");
    }
  };

  const requestMentor = async (id) => {
    try {
      await API.post(`/startups/${id}/request-mentor`);
      alert("Successfully broadcasted your startup to all mentors!");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        alert(err.response.data.message);
      } else {
        alert("Failed to request mentor.");
      }
    }
  };

  // --- Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // NEW: Handler for PDF file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPitchDeck(e.target.files[0]);
    }
  };

  // 1. Evaluate with AI (Remains JSON based)
  const evaluateIdea = async () => {
    if (!formData.idea || !formData.problem || !formData.users || !formData.domain) {
      setError("Please fill out the Idea, Problem, Target Users, and Domain fields to evaluate.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const aiData = {
        name: formData.name,
        idea: formData.idea,
        problem: formData.problem,
        users: formData.users,
        industry: formData.domain
      };
      const response = await API.post("/ai/evaluate", aiData);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to connect to the AI. Make sure your backend is running and the API key is correct!");
      }
    } finally {
      setLoading(false);
    }
  };

  const createStartup = async (e) => {
    e.preventDefault(); 
    
    if (!formData.name || !formData.domain || !formData.idea) {
      setError("Name, Domain, and Idea are required to create a profile.");
      return;
    }

    if (!result) {
      setError("Please click 'Evaluate with AI' to validate your startup before launching!");
      return;
    }

    if (result.verdict === 'Invalid Data') {
      setError("Your startup data was flagged as invalid or rubbish by the AI. Please provide a real startup idea before launching.");
      return;
    }

    // Create a FormData object to handle the file + text data
    const submitData = new FormData();
    submitData.append("title", formData.name);
    submitData.append("tagline", `Innovative ${formData.domain} startup`);
    submitData.append("domain", formData.domain);
    submitData.append("description", formData.idea);
    if (formData.fundingRequired) {
      submitData.append("fundingRequired", formData.fundingRequired);
    }
    
    // Append the file if the user selected one
    if (pitchDeck) {
      submitData.append("pitchDeck", pitchDeck);
    }

    try {
      // Send as multipart/form-data
      await API.post("/startups", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      alert("Startup Profile Launched Successfully! 🚀");
      socket.emit("newStartupCreated", `A new ${formData.domain} startup, ${formData.name}, just launched!`);

      // Reset form
      setFormData({ name: "", domain: "", idea: "", problem: "", users: "" });
      setPitchDeck(null); // Reset file
      setResult(null);
      fetchMyStartups();
      // Reset the file input UI manually
      document.getElementById("pitchDeckInput").value = ""; 
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
        alert(error.response.data.message);
      } else {
        setError("Failed to create startup.");
        alert("Failed to create startup.");
      }
    }
  };

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Founder', role: 'founder' };

  return (
    <DashboardLayout role="founder" userName={user.name}>
      
      {/* --- Floating Notifications Container --- */}
      <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        {notifications.map((notif) => (
          <div key={notif.id} className="toast show align-items-center text-white bg-dark border-0 shadow-lg mb-2" role="alert">
            <div className="d-flex">
              <div className="toast-body fw-semibold">
                🔔 {notif.text}
              </div>
              <button 
                type="button" 
                className="btn-close btn-close-white me-2 m-auto" 
                onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
              ></button>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="fw-bold text-dark">Founder Workspace</h2>
        <p className="text-muted">Draft your idea, get AI feedback, upload your pitch deck, and launch your profile.</p>
      </div>

      <div className="row">
        <div className="col-lg-8 mb-5">
          <div className="glass-panel p-4 p-md-5">
            <h4 className="fw-bold mb-4">Launch New Startup</h4>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Startup Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control bg-light border-0" placeholder="e.g., Nexus AI" required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Industry / Domain</label>
                  <input type="text" name="domain" value={formData.domain} onChange={handleChange} className="form-control bg-light border-0" placeholder="e.g., FinTech, Healthcare" required />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">The Idea (Description)</label>
                <textarea name="idea" value={formData.idea} onChange={handleChange} className="form-control bg-light border-0" rows="3" placeholder="What are you building? This will be your public description." required />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">The Problem</label>
                <textarea name="problem" value={formData.problem} onChange={handleChange} className="form-control bg-light border-0" rows="2" placeholder="What specific problem does this solve?" required />
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Target Audience</label>
                  <input type="text" name="users" value={formData.users} onChange={handleChange} className="form-control bg-light border-0" placeholder="Who are your primary users?" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold text-success">Funding Needed (₹)</label>
                  <input type="number" name="fundingRequired" value={formData.fundingRequired} onChange={handleChange} className="form-control bg-light border-0" placeholder="e.g. 50000" min="0" required />
                </div>
              </div>

              <div className="mb-4 p-4 border rounded bg-light" style={{ borderColor: 'var(--border-color) !important' }}>
                <label className="form-label fw-bold text-primary">📄 Upload Pitch Deck (PDF)</label>
                <input 
                  type="file" 
                  id="pitchDeckInput"
                  className="form-control border-0" 
                  accept="application/pdf" 
                  onChange={handleFileChange} 
                />
                <div className="form-text mt-2 text-muted">
                  Upload your business plan or pitch deck so Mentors and Investors can review it.
                </div>
              </div>

              {error && <div className="alert alert-danger border-0">{error}</div>}

              <div className="d-flex flex-column flex-md-row gap-3 mt-4 pt-3 border-top">
                <button type="button" onClick={evaluateIdea} className="btn btn-dark btn-lg flex-grow-1" disabled={loading}>
                  {loading ? (
                    <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Evaluating...</span>
                  ) : (
                    "🤖 Evaluate with AI"
                  )}
                </button>
                
                <button type="button" onClick={createStartup} className="btn btn-premium btn-lg flex-grow-1">
                  🚀 Launch Profile
                </button>
              </div>
            </form>

            {/* AI Results Section */}
            {result && (
              <div className="mt-5 p-4 bg-light border-start border-4 border-primary rounded shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="fw-bold text-primary mb-1">✨ AI Evaluation Results</h4>
                    {result.verdict && (
                      <span className={`badge badge-premium ${result.verdict === 'Invalid Data' ? 'bg-danger' : 'bg-primary-soft text-primary'} fs-6`}>
                        Verdict: {result.verdict}
                      </span>
                    )}
                  </div>
                  <span className="badge badge-premium bg-success">Complete</span>
                </div>
                
                <div className="row text-center mb-4 g-3">
                  <div className="col-4">
                    <div className="p-3 bg-white rounded shadow-sm">
                      <h2 className="text-primary fw-bold mb-0" style={{ fontFamily: 'Outfit' }}>{result.innovation}%</h2>
                      <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Innovation</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 bg-white rounded shadow-sm">
                      <h2 className="text-success fw-bold mb-0" style={{ fontFamily: 'Outfit' }}>{result.market}%</h2>
                      <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Market</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 bg-white rounded shadow-sm">
                      <h2 className="text-warning fw-bold mb-0" style={{ fontFamily: 'Outfit' }}>{result.feasibility}%</h2>
                      <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Feasibility</small>
                    </div>
                  </div>
                </div>
                
                <h6 className="fw-bold mb-3 mt-4">Actionable Suggestions:</h6>
                <ul className="list-group list-group-flush">
                  {result.suggestions?.map((suggestion, index) => (
                    <li key={index} className="list-group-item bg-transparent px-0 text-muted border-0 d-flex gap-2">
                      <span>💡</span> <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* My Startups Section */}
        <div className="col-lg-4">
          <h5 className="fw-bold mb-4">My Startups</h5>
          {myStartups.length === 0 ? (
            <div className="glass-panel p-4 text-center">
              <p className="text-muted mb-0">You haven't launched any startups yet.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {myStartups.map(startup => (
                <div className="startup-card" key={startup._id}>
                  <div className="startup-card-header py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold mb-0 text-truncate">{startup.title}</h5>
                      <span className={`badge badge-premium ${startup.status === 'Approved' ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
                        {startup.status}
                      </span>
                    </div>
                  </div>
                  <div className="startup-card-body py-3">
                    <span className="badge badge-premium bg-primary-soft text-primary mb-2 me-2">{startup.domain}</span>
                    <span className="badge badge-premium bg-secondary-soft text-secondary mb-2">Stage: {startup.stage}</span>
                    
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {startup.pitchDeck && (
                        <a href={startup.pitchDeck} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary w-100 mb-1">
                          View Pitch Deck
                        </a>
                      )}
                      <button onClick={() => requestMentor(startup._id)} className="btn btn-sm btn-outline-success flex-grow-1">
                        Get Mentor
                      </button>
                      <button onClick={() => deleteStartup(startup._id)} className="btn btn-sm btn-outline-danger">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StartupDashboard;