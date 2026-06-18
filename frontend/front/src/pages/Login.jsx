import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [data, setData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await API.post("/auth/login", data);
      const { token, role, _id, name } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("_id", _id);
      localStorage.setItem("name", name);

      if (role === 'founder') navigate('/startup');
      else if (role === 'mentor') navigate('/mentor');
      else if (role === 'investor') navigate('/investor');
      else if (role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0 rounded-lg mt-5">
            <div className="card-header bg-dark text-white text-center py-4">
              <h3 className="fw-bold mb-0">Welcome Back</h3>
            </div>
            <div className="card-body p-5">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label text-muted">Email Address</label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="name@example.com"
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Enter password"
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">
                  Login
                </button>
              </form>
            </div>
            <div className="card-footer text-center py-3 bg-light">
              <div className="small">
                Need an account? <Link to="/register">Sign up!</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;