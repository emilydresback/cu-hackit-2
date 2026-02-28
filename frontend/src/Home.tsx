import { Link } from "react-router-dom";
import "./App.css";

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">GovDocs Explorer</h1>
        <p className="hero-subtitle">
          Your gateway to understanding U.S. government documents
        </p>
        <p className="hero-description">
          Search and explore public documents from the Department of Justice and Federal Register.
          Access vital government information with clarity and transparency.
        </p>
        <Link to="/search" className="cta-button">
          Start Exploring
        </Link>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">📋</div>
          <h3>Department of Justice</h3>
          <p>Access press releases, legal documents, and official DOJ publications</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📰</div>
          <h3>Federal Register</h3>
          <p>Browse federal rules, proposed regulations, and public notices</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Powerful Search</h3>
          <p>Find exactly what you need with our intelligent search capabilities</p>
        </div>
      </div>

      <div className="info-section">
        <h2>Why GovDocs Explorer?</h2>
        <div className="info-content">
          <p>
            We believe government documents should be accessible to everyone. 
            GovDocs Explorer helps citizens, researchers, journalists, and legal professionals 
            navigate the vast landscape of U.S. government publications with ease.
          </p>
          <ul className="benefits-list">
            <li>✓ Free and open access to public records</li>
            <li>✓ Up-to-date information from official sources</li>
            <li>✓ Simple, intuitive interface</li>
            <li>✓ Direct links to original documents</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
