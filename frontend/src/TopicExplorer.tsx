// src/TopicExplorer.tsx
import React, { useState } from "react";
import { TOPICS } from "./topic";
import "./App.css";

// TODO: replace with your real Lambda URL
const LAMBDA_URL = "https://p8fh3grm0g.execute-api.us-east-1.amazonaws.com/prod/search";

// This shape matches what your Lambda returns
type SearchItem = {
  id: string;
  title: string;
  url: string;
  snippet: string;
  agency?: string;
  documentType?: string;
  publishedAt?: string;
  category?: string;
  source: string;
  tags?: string[];
};

function TopicExplorer() {
  const [selectedId, setSelectedId] = useState<string>(
    TOPICS[0]?.id ?? ""
  );
  const [customQuery, setCustomQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTopic = TOPICS.find((t) => t.id === selectedId);

  async function handleFetch() {
    if (!selectedTopic) return;

    setLoading(true);
    setError(null);
    setItems([]);

    try {
      const params = new URLSearchParams();
      params.set("topic", selectedTopic.api.topicId);

      // If the user typed something, send q=; else Lambda uses defaultQuery
      if (customQuery.trim()) {
        params.set("q", customQuery.trim());
      }

      const url = `${LAMBDA_URL}?${params.toString()}`;
      console.log("Requesting:", url);

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setItems(data.items || []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="topic-page">
      <h1 className="topic-title">Research Topics</h1>
      <p className="topic-subtitle">
        Choose a topic, optionally refine the query, and fetch live research
        results.
      </p>

      <div className="topic-controls">
        <div className="topic-field">
          <label htmlFor="topic">Topic</label>
          <select
            id="topic"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        <div className="topic-field">
          <label htmlFor="query">Optional search text</label>
          <input
            id="query"
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder={
              selectedTopic
                ? `Leave blank to use default: "${selectedTopic.api.defaultQuery}"`
                : "Search term"
            }
          />
        </div>

        <div className="topic-action">
          <button
            onClick={handleFetch}
            disabled={loading || !selectedTopic}
            className="topic-fetch-button"
          >
            {loading ? "Loading..." : "Fetch results"}
          </button>
        </div>
      </div>

      {selectedTopic && (
        <div className="topic-info">
          <div className="topic-info-title">
            {selectedTopic.title}
          </div>
          <div className="topic-info-description">
            {selectedTopic.description}
          </div>
          <div className="topic-info-meta">
            <strong>Sources:</strong>{" "}
            {selectedTopic.api.sources.join(", ")} ·{" "}
            <strong>Default query:</strong>{" "}
            <code>{selectedTopic.api.defaultQuery}</code>
          </div>
        </div>
      )}

      {error && (
        <div className="topic-error">
          Error: {error}
        </div>
      )}

      <div className="topic-results-section">
        <h2>
          Results ({items.length})
        </h2>
        <p>
          Newest items should appear first. Click a title to open the original
          source.
        </p>

        {items.length === 0 && !loading && !error && (
          <p className="topic-empty-state">
            No items yet. Try &ldquo;Fetch results&rdquo; or change the
            topic/query.
          </p>
        )}

        <ul className="topic-results-list">
          {items.map((item) => (
            <li
              key={`${item.source}:${item.id}`}
            >
              <div className="topic-result-title">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.title}
                </a>
              </div>
              <div className="topic-result-meta">
                {item.source}
                {item.agency ? ` · ${item.agency}` : ""}
                {item.documentType ? ` · ${item.documentType}` : ""}
                {item.publishedAt
                  ? ` · ${new Date(item.publishedAt).toLocaleDateString()}`
                  : ""}
                {item.category ? ` · ${item.category}` : ""}
              </div>
              {item.snippet && (
                <div className="topic-result-snippet">
                  {item.snippet}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TopicExplorer;