import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "founder",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await API.post("/auth/register", user);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card shadow-lg border-0 rounded-lg mt-4">
            <div className="card-header bg-dark text-white text-center py-4">
              <h3 className="fw-bold mb-0">Create an Account</h3>
            </div>
            <div className="card-body p-5">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={register}>
                <div className="mb-3">
                  <label className="form-label text-muted">Full Name</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="e.g., Jagadeesh"
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Email Address</label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="name@example.com"
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Create a password"
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted">I am a...</label>
                  <select 
                    className="form-select form-select-lg"
                    value={user.role}
                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                  >
                    <option value="founder">Startup Founder</option>
                    <option value="mentor">Platform Mentor</option>
                    <option value="investor">Angel Investor / VC</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">
                  Register
                </button>
              </form>
            </div>
            <div className="card-footer text-center py-3 bg-light">
              <div className="small">
                Already have an account? <Link to="/login">Go to login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;