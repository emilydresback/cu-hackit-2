import { useState } from "react";
import "./App.css";

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

function Search() {
  const API_BASE = import.meta.env.VITE_API_BASE as string;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    if (!query.trim()) return;

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
    <div className="search-page">
      <div className="search-header">
        <h1>Search Documents</h1>
        <p>
          Search public U.S. Department of Justice and Federal Register
          documents to help people better understand government publications.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="e.g. civil rights, fraud, antitrust..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <p className="error">Error: {error}</p>}

      {results.length > 0 && (
        <div className="results-count">
          Found {results.length} result{results.length !== 1 ? 's' : ''}
        </div>
      )}

      <ul className="results">
        {results.map((item) => {
          const dateStr = item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString()
            : "";

          return (
            <li key={`${item.source}-${item.id}`}>
              <a href={item.url} target="_blank" rel="noreferrer">
                {item.title}
              </a>

              <div className="date">
                {item.source.toUpperCase()}
                {item.agency ? ` • ${item.agency}` : ""}
                {item.documentType ? ` • ${item.documentType}` : ""}
                {dateStr ? ` • ${dateStr}` : ""}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Search;
