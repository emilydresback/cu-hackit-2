// src/TopicExplorer.tsx
import React, { useState } from "react";
import { TOPICS } from "./topic";

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
    <div
      style={{
        padding: "1.5rem 0",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.6rem" }}>Topic Explorer (Lambda Test)</h1>
      <p style={{ margin: "0.4rem 0 1.2rem", color: "#6b7280", fontSize: "0.9rem" }}>
        Pick a topic, optionally refine the search, and fetch real data from your
        Lambda.
      </p>

      {/* Controls */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2.3fr) minmax(0, 2fr) auto",
          gap: "0.75rem",
          marginBottom: "1.4rem",
        }}
      >
        {/* Topic selector */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label
            htmlFor="topic"
            style={{ fontSize: "0.85rem", color: "#374151" }}
          >
            Topic
          </label>
          <select
            id="topic"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            style={{
              padding: "0.45rem 0.6rem",
              borderRadius: "0.6rem",
              border: "1px solid #d1d5db",
              fontSize: "0.9rem",
            }}
          >
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {/* Custom query */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label
            htmlFor="query"
            style={{ fontSize: "0.85rem", color: "#374151" }}
          >
            Optional search text (q)
          </label>
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
            style={{
              padding: "0.45rem 0.6rem",
              borderRadius: "0.6rem",
              border: "1px solid #d1d5db",
              fontSize: "0.9rem",
            }}
          />
        </div>

        {/* Fetch button */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleFetch}
            disabled={loading || !selectedTopic}
            style={{
              padding: "0.55rem 1rem",
              borderRadius: "999px",
              border: "none",
              cursor: loading ? "default" : "pointer",
              background: loading ? "#9ca3af" : "#2563eb",
              color: "#ffffff",
              fontSize: "0.9rem",
              fontWeight: 600,
              boxShadow: "0 8px 18px rgba(37, 99, 235, 0.45)",
            }}
          >
            {loading ? "Loading..." : "Fetch results"}
          </button>
        </div>
      </div>

      {/* Topic info */}
      {selectedTopic && (
        <div
          style={{
            marginBottom: "1.4rem",
            padding: "0.8rem 0.9rem 0.9rem",
            borderRadius: "0.9rem",
            background: "#eef2ff",
            border: "1px dashed rgba(129, 140, 248, 0.7)",
          }}
        >
          <div
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#4f46e5",
              marginBottom: "0.25rem",
            }}
          >
            {selectedTopic.title}
          </div>
          <div style={{ fontSize: "0.88rem", color: "#4b5563" }}>
            {selectedTopic.description}
          </div>
          <div
            style={{
              marginTop: "0.45rem",
              fontSize: "0.8rem",
              color: "#6b7280",
            }}
          >
            <strong>Sources:</strong>{" "}
            {selectedTopic.api.sources.join(", ")} ·{" "}
            <strong>Default query:</strong>{" "}
            <code>{selectedTopic.api.defaultQuery}</code>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.6rem 0.75rem",
            borderRadius: "0.6rem",
            background: "#fef2f2",
            color: "#b91c1c",
            fontSize: "0.85rem",
            border: "1px solid #fecaca",
          }}
        >
          Error: {error}
        </div>
      )}

      {/* Results */}
      <div>
        <h2
          style={{
            margin: "0 0 0.35rem",
            fontSize: "1.05rem",
          }}
        >
          Results ({items.length})
        </h2>
        <p
          style={{
            margin: "0 0 0.7rem",
            fontSize: "0.85rem",
            color: "#6b7280",
          }}
        >
          Newest items should appear first. Click a title to open the original
          source.
        </p>

        {items.length === 0 && !loading && !error && (
          <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
            No items yet. Try &ldquo;Fetch results&rdquo; or change the
            topic/query.
          </p>
        )}

        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {items.map((item) => (
            <li
              key={`${item.source}:${item.id}`}
              style={{
                borderBottom: "1px solid #e5e7eb",
                padding: "0.7rem 0",
              }}
            >
              <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#2563eb", textDecoration: "none" }}
                >
                  {item.title}
                </a>
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "#6b7280",
                  marginTop: "0.1rem",
                }}
              >
                {item.source}
                {item.agency ? ` · ${item.agency}` : ""}
                {item.documentType ? ` · ${item.documentType}` : ""}
                {item.publishedAt
                  ? ` · ${new Date(item.publishedAt).toLocaleDateString()}`
                  : ""}
                {item.category ? ` · ${item.category}` : ""}
              </div>
              {item.snippet && (
                <div
                  style={{
                    marginTop: "0.25rem",
                    fontSize: "0.85rem",
                    color: "#374151",
                  }}
                >
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