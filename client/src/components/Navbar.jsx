import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav>
      {!isLoggedIn && (
        <>
          <Link to="/">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}

      {isLoggedIn && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/trade">Trade</Link>
          <Link to="/portfolio">Portfolio</Link>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
