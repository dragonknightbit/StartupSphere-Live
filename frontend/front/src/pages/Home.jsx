import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, TrendingUp, Users, Bot } from 'lucide-react';

function Home() {
  return (
    <div className="hero-section min-vh-100 d-flex flex-column">
      
      {/* Animated Background Blobs */}
      <div className="hero-blob hero-blob-1"></div>
      <div className="hero-blob hero-blob-2"></div>

      <div className="container flex-grow-1 d-flex flex-column justify-content-center hero-content py-5">
        <div className="row align-items-center">
          
          {/* Left Text Content */}
          <div className="col-lg-6 mb-5 mb-lg-0 pe-lg-5">
            <h1 className="display-2 fw-bold mb-4 fade-in-up text-white">
              Welcome to <br />
              <span className="text-gradient">StartupSphere</span>
            </h1>
            
            <p className="lead mb-5 fade-in-up delay-100 text-light opacity-75" style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
              The premier platform where visionary founders connect with strategic investors and experienced mentors. Leverage our proprietary AI to evaluate your startup's true potential.
            </p>
            
            <div className="d-flex flex-wrap gap-3 fade-in-up delay-200">
              <Link to="/ai-evaluator" className="btn-hero-primary text-decoration-none d-flex align-items-center">
                <Bot size={20} className="me-2" /> Try AI Evaluator
              </Link>
              <Link to="/startups" className="btn-hero-secondary text-decoration-none">
                Explore Startups
              </Link>
            </div>
          </div>
          
          {/* Right Glass Cards Grid */}
          <div className="col-lg-6 fade-in-up delay-300">
            <div className="row g-4">
              
              {/* Feature 1 */}
              <div className="col-sm-6">
                <div className="hero-glass-card h-100 d-flex flex-column">
                  <div className="hero-icon-wrapper text-gradient">
                    <Rocket size={32} />
                  </div>
                  <h3 className="h4 fw-bold mb-3 text-white">For Founders</h3>
                  <p className="text-light opacity-75 mb-0">
                    Showcase your vision, find the perfect mentors, and get the funding you need to scale.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="col-sm-6">
                <div className="hero-glass-card h-100 d-flex flex-column">
                  <div className="hero-icon-wrapper text-gradient-secondary">
                    <TrendingUp size={32} />
                  </div>
                  <h3 className="h4 fw-bold mb-3 text-white">For Investors</h3>
                  <p className="text-light opacity-75 mb-0">
                    Discover high-potential, AI-vetted startups and track their growth metrics instantly.
                  </p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="col-12">
                <div className="hero-glass-card">
                  <div className="d-flex align-items-center mb-3">
                    <div className="hero-icon-wrapper text-warning mb-0 me-3" style={{ width: '45px', height: '45px' }}>
                      <Users size={24} />
                    </div>
                    <h3 className="h4 fw-bold mb-0 text-white">For Mentors</h3>
                  </div>
                  <p className="text-light opacity-75 mb-0">
                    Share your expertise and guide the next generation of industry-disrupting startups to success.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;