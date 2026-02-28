import { useState } from 'react';
import './App.css';

type SourceId = "doj" | "federal_register";

interface DocItem {
  id: string;
  source: SourceId;
  title: string;
  url: string;
  publishedAt?: string;   // ISO string from your Lambda
  snippet?: string;
  agency?: string;
  documentType?: string;
  category?: string;
}

function App() {
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
    search();
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '1.5rem' }}>
      <h1>GovDocs Explorer (DOJ)</h1>
      <p>
        Search public U.S. Department of Justice press releases by title to help
        people explore government documents.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="e.g. civil rights, fraud, antitrust..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: '0.5rem',
            width: '70%',
            marginRight: '0.5rem',
          }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Search
        </button>
      </form>

      {loading && <p style={{ marginTop: '1rem' }}>Loading…</p>}
      {error && (
        <p style={{ marginTop: '1rem', color: 'red' }}>Error: {error}</p>
      )}

      <ul style={{ marginTop: '1.5rem', listStyle: 'none', padding: 0 }}>
        {results.map((item) => {
          const dateStr = item.publishedAt
          ? new Date(item.publishedAt).toLocaleDateString()
          : "";

          return (
            <li
              key={`${item.source}-${item.id}`}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: '0.75rem 1rem',
                marginBottom: '0.75rem',
              }}
            >
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                style={{ fontWeight: 'bold', textDecoration: 'none' }}
              >
                {item.title}
              </a>
              <div style={{ fontSize: "0.85rem", color: "#555", marginTop: 6 }}>
                {item.source.toUpperCase()}
                {item.agency ? ` • ${item.agency}` : ""}
                {item.documentType ? ` • ${item.documentType}` : ""}
                {dateStr ? ` • ${dateStr}` : ""}
              </div>
            </li>
          );
        })}
      </ul>

      {!loading && !error && results.length === 0 && (
        <p style={{ marginTop: '1rem' }}>
          Try searching for something like <strong>"civil rights"</strong> or{' '}
          <strong>"health care fraud"</strong>.
        </p>
      )}
    </div>
  );
}

export default App;