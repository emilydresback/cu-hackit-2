import { Link } from "react-router-dom";
import clipboardImg from "./assets/clipboard.png";
import newspaperImg from "./assets/newspaper.png";
import glassImg from "./assets/glass.png";
import "./App.css";

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-badge">Learn Through Experience • Personalized Understanding</div>
        <h1 className="hero-title">Your Learning Journey</h1>
        <p className="hero-subtitle">
          Learn topics that matter to you by connecting with your own experiences and perspectives
        </p>
        <p className="hero-description">
          Move beyond passive reading. Have real conversations about topics you care about, understand 
          how they connect to your life, and build knowledge that actually sticks with you.
        </p>
        <Link to="/search" className="cta-button">
          Explore Topics
        </Link>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <img src={clipboardImg} alt="Chat" className="feature-icon" />
          <h3>Conversation-Based Learning</h3>
          <p>Chat with an AI that understands your perspective and helps you explore topics your way</p>
        </div>

        <div className="feature-card">
          <img src={newspaperImg} alt="Personal Insights" className="feature-icon" />
          <h3>Make It Personal</h3>
          <p>Connect new information to your experiences and build understanding that resonates with you</p>
        </div>

        <div className="feature-card">
          <img src={glassImg} alt="Deep Understanding" className="feature-icon" />
          <h3>Deeper Understanding</h3>
          <p>Go beyond surface-level facts to truly understand why topics matter and how they affect your world</p>
        </div>
      </div>

      <div className="info-section">
        <h2>Why This Approach?</h2>
        <div className="info-content">
          <p>
            Learning sticks when it's personal. Instead of scrolling through disconnected articles, 
            you'll have thoughtful conversations that help you understand topics in relation to your 
            own experiences. This makes learning more impactful than trying to navigate research on your own.
          </p>
          <ul className="benefits-list">
            <li>✓ Interactive conversations instead of passive reading</li>
            <li>✓ Get answers tailored to what you actually want to know</li>
            <li>✓ Understand the real-world relevance to your life</li>
            <li>✓ Build lasting knowledge that feels meaningful</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
