import React, { useState, useEffect } from "react";
import API from "../services/api";
import DashboardLayout from "../components/layout/DashboardLayout";

function MentorDashboard() {
  const [requests, setRequests] = useState([]);
  const [myStartups, setMyStartups] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState(null); // startupId
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchRequests();
    fetchMyStartups();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/mentor/requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyStartups = async () => {
    try {
      const res = await API.get("/mentor/my-startups");
      setMyStartups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const acceptRequest = async (id) => {
    try {
      await API.put(`/mentor/requests/${id}/accept`);
      const acceptedReq = requests.find(r => r._id === id);
      setRequests(requests.filter(r => r._id !== id));
      if (acceptedReq) {
        setMyStartups([...myStartups, acceptedReq]);
        setFeedbackForm(acceptedReq.startupId._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      await API.post("/mentor/feedback", {
        startupId: feedbackForm,
        feedback: feedbackText,
        rating
      });
      alert("Feedback submitted!");
      setFeedbackForm(null);
      setFeedbackText("");
      setRating(5);
    } catch (err) {
      console.error(err);
      alert("Failed to submit feedback.");
    }
  };

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Mentor', role: 'mentor' };

  return (
    <DashboardLayout role="mentor" userName={user.name}>
      
      <div className="row">
        <div className="col-lg-8">
          
          <h4 className="fw-bold mb-3">Pending Startup Requests</h4>
          <div className="glass-panel overflow-hidden mb-5">
            <ul className="list-group list-group-flush">
              {requests.length === 0 ? (
                <li className="list-group-item p-4 text-muted border-0 text-center">No pending requests.</li>
              ) : (
                requests.map(req => (
                  <li key={req._id} className="list-group-item d-flex justify-content-between align-items-start p-4 border-bottom">
                    <div className="ms-2 me-auto">
                      <div className="fw-bold fs-5 mb-1">{req.startupId?.title}</div>
                      <div>
                        <span className="badge badge-premium bg-primary-soft text-primary me-2">{req.startupId?.domain}</span>
                        <span className="text-muted small">Founder: {req.founderId?.name}</span>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      {req.startupId?.pitchDeck && (
                        <a href={req.startupId.pitchDeck} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">View Pitch</a>
                      )}
                      <button className="btn btn-sm btn-premium" onClick={() => acceptRequest(req._id)}>Accept</button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          {feedbackForm && (
            <div className="glass-panel p-4 mb-5 border-start border-primary border-4 shadow-lg">
              <h5 className="fw-bold mb-4">Provide Initial Feedback</h5>
              <form onSubmit={submitFeedback}>
                <div className="mb-3">
                  <label className="form-label fw-medium">Constructive Feedback</label>
                  <textarea 
                    className="form-control bg-light border-0" 
                    rows="4" 
                    value={feedbackText} 
                    onChange={(e) => setFeedbackText(e.target.value)} 
                    placeholder="Share your insights and advice for this founder..."
                    required 
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-medium">Rating (1-5)</label>
                  <input 
                    type="number" 
                    className="form-control bg-light border-0" 
                    min="1" max="5" 
                    value={rating} 
                    onChange={(e) => setRating(e.target.value)} 
                    required 
                  />
                </div>
                <div className="d-flex gap-3">
                  <button type="submit" className="btn btn-premium flex-grow-1">Submit Feedback</button>
                  <button type="button" className="btn btn-light border flex-grow-1" onClick={() => setFeedbackForm(null)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <h4 className="fw-bold mb-3">My Startups</h4>
          <div className="startup-grid mb-5">
            {myStartups.length === 0 ? (
              <div className="glass-panel p-4 text-muted w-100 text-center">You are not mentoring any startups yet.</div>
            ) : (
              myStartups.map(req => (
                <div className="metric-card p-4" key={req._id}>
                  <h6 className="fw-bold mb-2 fs-5">{req.startupId?.title}</h6>
                  <span className="badge badge-premium bg-primary-soft text-primary">{req.startupId?.domain}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="metric-card p-5 text-center mb-4 border-0" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white' }}>
            <h5 className="fw-semibold mb-3 text-white" style={{ opacity: 0.9 }}>Mentor Impact Score</h5>
            <h1 className="display-3 fw-bold text-white mb-2" style={{ fontFamily: 'Outfit' }}>4.8<span className="fs-3 text-white-50">/5</span></h1>
            <p className="mb-0 text-white" style={{ opacity: 0.8 }}>Based on your recent startup reviews.</p>
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
}

export default MentorDashboard;