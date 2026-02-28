import { Link, useLocation } from "react-router-dom";
import supremeCourtImg from "./assets/supremecourt.png";
import "./App.css";

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={supremeCourtImg} alt="Research Docs" className="logo-icon" />
          <span className="logo-text">Research Docs</span>
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
            Explore
          </Link>
          <Link
            to="/topics"
            className={`nav-link ${location.pathname === '/topics' ? 'active' : ''}`}
          >
            Topics
          </Link>
          <Link
            to="/chat"
            className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}
          >
            Chat
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
