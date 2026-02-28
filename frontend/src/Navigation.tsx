import { Link, useLocation } from "react-router-dom";
import "./App.css";

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🏛️</span>
          <span className="logo-text">GovDocs Explorer</span>
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/search" 
            className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}
          >
            Search
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
