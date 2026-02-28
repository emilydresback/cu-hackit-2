import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./Navigation";
import Home from "./Home";
import Search from "./Search";
import TopicExplorer from "./TopicExplorer"; // ⬅️ new import
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            {/* New debug / testing route */}
            <Route path="/topics" element={<TopicExplorer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;