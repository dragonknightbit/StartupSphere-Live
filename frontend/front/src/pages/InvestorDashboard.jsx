import React, { useState, useEffect } from "react";
import API from "../services/api";
import DashboardLayout from "../components/layout/DashboardLayout";

function InvestorDashboard() {
  const [startups, setStartups] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [myInterests, setMyInterests] = useState([]);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("");
  const [stage, setStage] = useState("");
  const [interestForm, setInterestForm] = useState(null); // startupId
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Investor', role: 'investor' };

  useEffect(() => {
    fetchStartups();
    fetchMyInterests();
    fetchRecommendations();
  }, []);

  const fetchStartups = async () => {
    try {
      let query = `/investor/startups?search=${search}`;
      if (domain) query += `&domain=${domain}`;
      if (stage) query += `&stage=${stage}`;
      const res = await API.get(query);
      setStartups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await API.get("/investor/recommendations");
      setRecommendations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyInterests = async () => {
    try {
      const res = await API.get("/investor/my-interests");
      setMyInterests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    fetchStartups();
  };

  const expressInterest = async (e) => {
    e.preventDefault();
    try {
      await API.post("/investor/interest", {
        startupId: interestForm,
        message
      });
      alert("Interest expressed successfully!");
      setInterestForm(null);
      setMessage("");
      fetchMyInterests();
    } catch (err) {
      console.error(err);
      alert("Failed to express interest.");
    }
  };

  const renderStartupCard = (startup, isRecommended = false) => (
    <div className="startup-card h-100" key={startup._id}>
      <div className="startup-card-header">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <span className="badge badge-premium bg-primary-soft text-primary me-2">{startup.domain}</span>
            <span className="badge badge-premium bg-secondary-soft text-success">{startup.stage}</span>
          </div>
          {isRecommended && <span className="badge badge-premium bg-warning text-dark">✨ AI Match</span>}
        </div>
        <h4 className="fw-bold mb-1">{startup.title}</h4>
      </div>
      
      <div className="startup-card-body">
        <p className="text-muted small mb-3">{startup.description.substring(0, 100)}...</p>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="text-muted small d-block">Seeking</span>
            <span className="fw-bold fs-5 text-dark">₹{startup.fundingRequired.toLocaleString('en-IN')}</span>
          </div>
          {startup.aiScore && (
            <div className="text-end">
              <span className="text-muted small d-block">AI Score</span>
              <span className="fw-bold text-primary">{startup.aiScore.innovation}/100</span>
            </div>
          )}
        </div>

        {interestForm === startup._id ? (
          <form onSubmit={expressInterest} className="mt-4 border-top pt-3">
            <textarea 
              className="form-control mb-2" 
              rows="2" 
              placeholder="Add a message for the founder..." 
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            ></textarea>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-premium btn-sm flex-grow-1">Send</button>
              <button type="button" className="btn btn-light btn-sm flex-grow-1 border" onClick={() => setInterestForm(null)}>Cancel</button>
            </div>
          </form>
        ) : (
          <button className="btn btn-premium w-100 mt-4" onClick={() => setInterestForm(startup._id)}>
            Express Interest
          </button>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout role="investor" userName={user.name}>
      
      {/* Top Recommendations Row */}
      {recommendations.length > 0 && (
        <div className="mb-5">
          <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <span>🎯</span> Recommended For You
          </h4>
          <div className="startup-grid">
            {recommendations.map(s => renderStartupCard(s, true))}
          </div>
        </div>
      )}

      {/* Main Filter Section */}
      <div className="glass-panel p-4 mb-5">
        <h5 className="fw-bold mb-4">Discover Deals</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <input 
              type="text" 
              className="form-control form-control-lg bg-light border-0" 
              placeholder="Search startups by name or keyword..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="col-md-3">
            <select className="form-select form-select-lg bg-light border-0" value={domain} onChange={e => setDomain(e.target.value)}>
              <option value="">All Domains</option>
              <option value="FinTech">FinTech</option>
              <option value="HealthTech">HealthTech</option>
              <option value="EdTech">EdTech</option>
              <option value="SaaS">SaaS</option>
              <option value="E-commerce">E-commerce</option>
              <option value="AI">AI</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select form-select-lg bg-light border-0" value={stage} onChange={e => setStage(e.target.value)}>
              <option value="">All Stages</option>
              <option value="Idea">Idea</option>
              <option value="MVP">MVP</option>
              <option value="Early Revenue">Early Revenue</option>
              <option value="Scaling">Scaling</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Startup Results */}
        <div className="col-lg-8 mb-4">
          <h5 className="fw-bold mb-3">All Approved Startups</h5>
          <div className="startup-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {startups.length === 0 ? (
              <div className="col-12"><p className="text-muted">No startups found matching your criteria.</p></div>
            ) : (
              startups.map(s => renderStartupCard(s))
            )}
          </div>
        </div>

        {/* Right Sidebar - Interests */}
        <div className="col-lg-4">
          <div className="glass-panel overflow-hidden">
            <div className="p-4 border-bottom bg-light">
              <h5 className="fw-bold mb-0">My Active Interests</h5>
            </div>
            <ul className="list-group list-group-flush">
              {myInterests.length === 0 ? (
                <li className="list-group-item p-4 text-muted text-center border-0">No active interests.</li>
              ) : (
                myInterests.map(interest => (
                  <li className="list-group-item p-4 border-bottom" key={interest._id}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="fw-bold mb-0">{interest.startupId?.title}</h6>
                      <span className={`badge badge-premium ${interest.status === 'interested' ? 'bg-primary-soft text-primary' : 'bg-success text-white'}`}>
                        {interest.status}
                      </span>
                    </div>
                    <p className="small text-muted mb-0 text-truncate">{interest.message}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
}

export default InvestorDashboard;