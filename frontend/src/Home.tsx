import { Link } from "react-router-dom";
import clipboardImg from "./assets/clipboard.png";
import newspaperImg from "./assets/newspaper.png";
import glassImg from "./assets/glass.png";
import "./App.css";

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-badge">Evidence-first • Modern research workspace</div>
        <h1 className="hero-title">Research Docs</h1>
        <p className="hero-subtitle">
          A clear workspace for public-policy and government-document research
        </p>
        <p className="hero-description">
          Search trusted public sources, compare signals quickly, and move from
          questions to evidence with less noise and more focus.
        </p>
        <Link to="/search" className="cta-button">
          Start Research
        </Link>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <img src={clipboardImg} alt="DOJ" className="feature-icon" />
          <h3>Primary Sources</h3>
          <p>Review DOJ and Federal Register records directly from official publishers</p>
        </div>

        <div className="feature-card">
          <img src={newspaperImg} alt="Federal Register" className="feature-icon" />
          <h3>Structured Discovery</h3>
          <p>Scan results by agency, type, and date for faster evidence triage</p>
        </div>

        <div className="feature-card">
          <img src={glassImg} alt="Search" className="feature-icon" />
          <h3>Focused Interface</h3>
          <p>Minimal interactions reduce cognitive load and keep attention on content</p>
        </div>
      </div>

      <div className="info-section">
        <h2>Why Research Docs?</h2>
        <div className="info-content">
          <p>
            Research Docs is designed for students, analysts, journalists, and
            policy teams who need to gather reliable context quickly. The design
            emphasizes readability, consistency, and direct access to source material.
          </p>
          <ul className="benefits-list">
            <li>✓ Clear visual hierarchy for faster scanning</li>
            <li>✓ Consistent patterns that reduce interaction friction</li>
            <li>✓ Accessible contrast and spacious typography</li>
            <li>✓ Direct links to original source documents</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
