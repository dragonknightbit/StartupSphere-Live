import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container-fluid bg-light py-5 min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="text-center px-3" style={{ maxWidth: '800px' }}>
        
        {/* Main Title */}
        <h1 className="display-3 fw-bold text-dark mb-4">
          StartupSphere
        </h1>
        
        {/* Subtitle */}
        <h2 className="h3 fw-normal text-secondary mb-4">
          Connect Startups, Mentors, and Investors
        </h2>
        
        {/* Description */}
        <p className="lead text-muted mb-5">
          A platform where founders get mentorship, discover funding opportunities, and leverage AI to evaluate their startup's true potential.
        </p>
        
        {/* Call to Action Buttons */}
        <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
          
          {/* Primary Button: AI Evaluator */}
          <Link to="/ai-evaluator" className="btn btn-primary btn-lg px-5 shadow-sm">
            Try AI Evaluator
          </Link>
          
          {/* Secondary Button: Explore */}
          <Link to="/startups" className="btn btn-outline-secondary btn-lg px-5">
            Explore Startups
          </Link>
          
        </div>
      </div>
    </div>
  );
}

export default Home;