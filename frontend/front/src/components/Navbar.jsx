import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          <span className="text-white">Startup</span>Sphere
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2 align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/startups">Browse Startups</Link>
            </li>
            {role === 'founder' && (
              <li className="nav-item">
                <Link className="nav-link" to="/startup">Dashboard</Link>
              </li>
            )}
            {role === 'mentor' && (
              <li className="nav-item">
                <Link className="nav-link" to="/mentor">Dashboard</Link>
              </li>
            )}
            {role === 'investor' && (
              <li className="nav-item">
                <Link className="nav-link" to="/investor">Dashboard</Link>
              </li>
            )}
            {role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Dashboard</Link>
              </li>
            )}
            
            {token ? (
              <>
                <li className="nav-item ms-lg-3">
                  <span className="nav-link text-white">Hi, {name}</span>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-danger px-4">Logout</button>
                </li>
              </>
            ) : (
              <li className="nav-item ms-lg-3">
                <Link className="btn btn-outline-light px-4" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;