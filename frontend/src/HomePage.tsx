import './HomePage.css';

interface HomePageProps {
  onGetStarted: () => void;
}

function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">GovDocs Explorer</span>
          </h1>
          <p className="hero-subtitle">
            Your gateway to government transparency
          </p>
          <p className="hero-description">
            Search through thousands of U.S. Department of Justice press releases
            and Federal Register documents. Make government information accessible
            and understandable for everyone.
          </p>
          <button className="cta-button" onClick={onGetStarted}>
            Start Exploring
            <span className="arrow">→</span>
          </button>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Smart Search</h3>
            <p>Advanced search across multiple government sources</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Get results instantly with our optimized search engine</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Comprehensive</h3>
            <p>Access DOJ press releases and Federal Register documents</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Accurate Results</h3>
            <p>Find exactly what you're looking for with precision</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>What Can You Find?</h2>
        <div className="info-grid">
          <div className="info-item">
            <h4>Civil Rights Cases</h4>
            <p>Track important civil rights litigation and enforcement actions</p>
          </div>
          <div className="info-item">
            <h4>Fraud Investigations</h4>
            <p>Stay informed about fraud cases and enforcement</p>
          </div>
          <div className="info-item">
            <h4>Antitrust Actions</h4>
            <p>Monitor competition and antitrust enforcement</p>
          </div>
          <div className="info-item">
            <h4>Federal Regulations</h4>
            <p>Browse proposed and final rules from government agencies</p>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <p>Empowering citizens with access to government information</p>
      </footer>
    </div>
  );
}

export default HomePage;
