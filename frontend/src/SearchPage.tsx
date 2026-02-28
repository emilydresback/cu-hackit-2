import { useState } from 'react';
import './SearchPage.css';

type SourceId = "doj" | "federal_register";

interface DocItem {
  id: string;
  source: SourceId;
  title: string;
  url: string;
  publishedAt?: string;
  snippet?: string;
  agency?: string;
  documentType?: string;
  category?: string;
}

interface SearchPageProps {
  onBackHome: () => void;
}

function SearchPage({ onBackHome }: SearchPageProps) {
  const API_BASE = import.meta.env.VITE_API_BASE as string;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    setLoading(true);
    setError("");
    setResults([]);
  
    try {
      if (!API_BASE) throw new Error("VITE_API_BASE is not set");
  
      const url = `${API_BASE}/search?q=${encodeURIComponent(
        query
      )}&sources=doj,federal_register&page=0&pageSize=10`;
  
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
      const data = await res.json();
      setResults(data.items || []);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      search();
    }
  };

  return (
    <div className="search-page">
      <header className="search-header">
        <div className="header-content">
          <button className="back-button" onClick={onBackHome}>
            ← Back to Home
          </button>
          <h1 className="search-title">GovDocs Explorer</h1>
        </div>
      </header>

      <div className="search-container">
        <div className="search-box">
          <form onSubmit={handleSubmit}>
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search for civil rights, fraud, antitrust, regulations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                🔍 Search
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Searching government documents...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p>⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="results-container">
            <p className="results-count">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            <ul className="results-list">
              {results.map((item) => {
                const dateStr = item.publishedAt
                  ? new Date(item.publishedAt).toLocaleDateString()
                  : "";

                return (
                  <li key={`${item.source}-${item.id}`} className="result-item">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="result-title"
                    >
                      {item.title}
                    </a>
                    <div className="result-meta">
                      <span className="badge">{item.source.toUpperCase()}</span>
                      {item.agency && <span className="meta-item">{item.agency}</span>}
                      {item.documentType && <span className="meta-item">{item.documentType}</span>}
                      {dateStr && <span className="meta-item">📅 {dateStr}</span>}
                    </div>
                    {item.snippet && (
                      <p className="result-snippet">{item.snippet}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {!loading && !error && results.length === 0 && query && (
          <div className="no-results">
            <p>No results found for "{query}"</p>
            <p className="suggestion">Try searching for:</p>
            <ul className="example-searches">
              <li>"civil rights"</li>
              <li>"health care fraud"</li>
              <li>"antitrust enforcement"</li>
              <li>"environmental protection"</li>
            </ul>
          </div>
        )}

        {!loading && !error && results.length === 0 && !query && (
          <div className="welcome-message">
            <h2>Start Your Search</h2>
            <p>Enter keywords to search through thousands of government documents</p>
            <div className="search-tips">
              <h3>Popular Topics:</h3>
              <div className="topic-tags">
                <span className="topic-tag" onClick={() => setQuery('civil rights')}>civil rights</span>
                <span className="topic-tag" onClick={() => setQuery('fraud')}>fraud</span>
                <span className="topic-tag" onClick={() => setQuery('antitrust')}>antitrust</span>
                <span className="topic-tag" onClick={() => setQuery('environment')}>environment</span>
                <span className="topic-tag" onClick={() => setQuery('consumer protection')}>consumer protection</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
