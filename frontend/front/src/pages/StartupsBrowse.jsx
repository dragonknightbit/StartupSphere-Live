import React, { useState, useEffect } from "react";
import API from "../services/api";

function StartupsBrowse() {
  const [startups, setStartups] = useState([]);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("");
  const [stage, setStage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStartups();
  }, [domain, stage]); // refetch when filters change

  const fetchStartups = async () => {
    try {
      setLoading(true);
      let query = `/startups?search=${search}`;
      if (domain) query += `&domain=${domain}`;
      if (stage) query += `&stage=${stage}`;
      const res = await API.get(query);
      // Display all startups instead of filtering by 'Approved' for easier testing
      setStartups(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStartups();
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark display-5">Discover Innovative Startups</h2>
        <p className="text-muted lead">Explore the next big ideas and connect with founders.</p>
      </div>

      <div className="row mb-5 justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm border-0 p-4">
            <form onSubmit={handleSearch} className="row g-3">
              <div className="col-md-6">
                <input 
                  type="text" 
                  className="form-control form-control-lg bg-light border-0" 
                  placeholder="Search by title..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
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
                  <option value="AI / ML">AI / ML</option>
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
            </form>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {startups.length === 0 ? (
            <div className="col-12 text-center mt-5">
              <h4 className="text-muted">No approved startups found matching your criteria.</h4>
            </div>
          ) : (
            startups.map(startup => (
              <div className="col-md-6 col-lg-4" key={startup._id}>
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="mb-3">
                      <span className="badge bg-primary bg-opacity-10 text-primary me-2 px-3 py-2 rounded-pill">{startup.domain}</span>
                      <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill">{startup.stage}</span>
                    </div>
                    
                    <h4 className="card-title fw-bold mb-2">{startup.title}</h4>
                    <p className="card-text text-muted flex-grow-1">{startup.description}</p>
                    
                    <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted d-block">Funding Needed</small>
                        <span className="text-success fw-bold fs-5">${startup.fundingRequired?.toLocaleString() || 0}</span>
                      </div>
                      
                      {startup.pitchDeck ? (
                        <a href={startup.pitchDeck} target="_blank" rel="noreferrer" className="btn btn-outline-dark">
                          View Pitch Deck
                        </a>
                      ) : (
                        <button className="btn btn-outline-secondary" disabled>No Pitch Deck</button>
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <small className="text-muted">Are you an investor? Log in to your <a href="/login" className="text-decoration-none">Dashboard</a> to Express Interest!</small>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default StartupsBrowse;
