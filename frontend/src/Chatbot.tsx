import { FormEvent, useMemo, useState } from "react";
import { TOPICS, type TopicConfig } from "./topic";
import "./App.css";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

// This shape matches what your Lambda returns for /search
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

// Fallback in case VITE_API_BASE is not set
const FALLBACK_SEARCH_URL =
  "https://p8fh3grm0g.execute-api.us-east-1.amazonaws.com/prod/search";

function Chatbot() {
  const apiBaseRaw = import.meta.env.VITE_API_BASE as string;
  const apiBase = (apiBaseRaw || "").replace(/\/+$/, ""); // remove trailing slash

  // Keyword-extraction endpoint
  const chatEndpoint = apiBase ? `${apiBase}/govdocs-chat` : "";

  // Topic search endpoint (either derived from base or the direct Lambda URL)
  const searchEndpoint = apiBase ? `${apiBase}/search` : FALLBACK_SEARCH_URL;

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Keywords returned from /chat
  const [keywords, setKeywords] = useState<string[]>([]);

  // Chat conversation
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Pick a topic, read the guiding questions, then tell me about your situation. I’ll pull out keywords and search live sources for you.",
      timestamp: new Date().toISOString(),
    },
  ]);

  // Topic selection + search results
  const [selectedId, setSelectedId] = useState<string>(TOPICS[0]?.id ?? "");
  const [items, setItems] = useState<SearchItem[]>([]);

  const selectedTopic: TopicConfig | undefined = useMemo(
    () => TOPICS.find((t) => t.id === selectedId),
    [selectedId]
  );

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  // Parse keywords from backend response: { keywords: string[] }
  const parseKeywords = (data: unknown): string[] => {
    if (!data || typeof data !== "object") return [];
    const obj = data as Record<string, unknown>;
    const kws = obj.keywords;
    if (!Array.isArray(kws)) return [];
    return kws
      .filter((k): k is string => typeof k === "string")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
  };

  const sendMessage = async () => {
    if (!canSend) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add the user’s message to the chat
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    // Clear previous results when starting a fresh query
    setItems([]);

    if (!chatEndpoint) {
      setError("Set VITE_API_BASE to connect the /chat API endpoint.");
      return;
    }

    setLoading(true);

    try {
      // 1) Call /chat to get keywords
      const res = await fetch(chatEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with HTTP ${res.status}`);
      }

      const data = await res.json();
      const kws = parseKeywords(data);

      // Save keywords for UI + follow-up logic
      setKeywords(kws);

      // Show keywords in the chat UI
      const assistantText =
        kws.length > 0 ? `Keywords: ${kws.join(", ")}` : "No keywords found.";

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // 2) Use the selected topic + keywords to call /search
      if (!selectedTopic) {
        // No topic selected (shouldn’t happen because we default to the first one)
        return;
      }

      if (!searchEndpoint) {
        // We have keywords but no search endpoint configured
        return;
      }

      const params = new URLSearchParams();
      params.set("topic", selectedTopic.api.topicId);

      // Use the AI-extracted keywords as q=, falling back to Lambda's defaultQuery
      if (kws.length > 0) {
        params.set("q", kws.join(" "));
      }

      const searchUrl = `${searchEndpoint}?${params.toString()}`;
      console.log("Requesting topic search:", searchUrl);

      const searchRes = await fetch(searchUrl);
      if (!searchRes.ok) {
        throw new Error(`Search failed with HTTP ${searchRes.status}`);
      }

      const searchJson = await searchRes.json();
      const newItems: SearchItem[] = Array.isArray(searchJson.items)
        ? searchJson.items
        : [];

      setItems(newItems);
    } catch (err: unknown) {
      console.error("Chat or search error:", err);
      const message =
        err instanceof Error ? err.message : "Unable to reach the service.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <section className="chat-page">
      <header className="chat-header">
        <h1>Guided Topic Chat</h1>
        <p>
          Choose a topic, reflect with the guiding question, then describe your
          situation in your own words. I’ll extract keywords and search relevant
          government and public data sources for you.
        </p>

        {/* Topic chooser */}
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
        </div>

        {/* Topic details / guiding prompts */}
        {selectedTopic && (
          <div className="topic-selected">
            <h2 className="topic-selected-title">{selectedTopic.title}</h2>
            <p className="topic-selected-subtitle">
              {selectedTopic.subtitle}
            </p>
            <p className="topic-selected-description">
              {selectedTopic.description}
            </p>
            <p className="topic-selected-reflective">
              <strong>Reflect:</strong> {selectedTopic.reflectivePrompt}
            </p>
            <p className="topic-selected-example">
              <strong>Example starter:</strong> {selectedTopic.exampleStarter}
            </p>
            <div className="topic-info-meta">
              <strong>Sources:</strong>{" "}
              {selectedTopic.api.sources.join(", ")} ·{" "}
              <strong>Default query:</strong>{" "}
              <code>{selectedTopic.api.defaultQuery}</code>
            </div>
          </div>
        )}

        {/* Optional: show keyword “chips” outside the chat */}
        {keywords.length > 0 && (
          <div
            style={{
              marginTop: 8,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {keywords.map((k) => (
              <span
                key={k}
                style={{
                  border: "1px solid rgba(255,255,255,0.25)",
                  padding: "4px 8px",
                  borderRadius: 999,
                  fontSize: 12,
                }}
              >
                {k}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="chat-shell">
        <div className="chat-messages" role="log" aria-live="polite">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`chat-bubble ${message.role}`}
            >
              <div className="chat-bubble-role">
                {message.role === "assistant" ? "Assistant" : "You"}
              </div>
              <p>{message.content}</p>
            </article>
          ))}

          {loading && (
            <article className="chat-bubble assistant loading">
              <div className="chat-bubble-role">Assistant</div>
              <p>Working on your keywords and results…</p>
            </article>
          )}
        </div>

        {error && <p className="chat-error">Error: {error}</p>}

        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Describe your situation or question in your own words…"
            aria-label="Chat message"
          />
          <button type="submit" disabled={!canSend}>
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>

      {/* Results section using the topic search API */}
      <div className="topic-results-section">
        <h2>Results ({items.length})</h2>
        <p>
          Newest items should appear first. Click a title to open the original
          source.
        </p>

        {items.length === 0 && !loading && !error && (
          <p className="topic-empty-state">
            No items yet. Pick a topic, send a message above, and I’ll search
            for you.
          </p>
        )}

        <ul className="topic-results-list">
          {items.map((item) => (
            <li key={item.id} className="topic-result-item">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="topic-result-title"
              >
                {item.title}
              </a>
              <div className="topic-result-meta">
                {item.source && <span>{item.source}</span>}
                {item.agency ? ` · ${item.agency}` : ""}
                {item.documentType ? ` · ${item.documentType}` : ""}
                {item.publishedAt
                  ? ` · ${new Date(
                      item.publishedAt
                    ).toLocaleDateString()}`
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
    </section>
  );
}

export default Chatbot;