import { FormEvent, useMemo, useState } from "react";
import "./App.css";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

function Chatbot() {
  const apiBaseRaw = import.meta.env.VITE_API_BASE as string;
  const apiBase = (apiBaseRaw || "").replace(/\/+$/, ""); // remove trailing slash
  const chatEndpoint = apiBase ? `${apiBase}/chat` : "";

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Optional: store keywords for other frontend features
  const [keywords, setKeywords] = useState<string[]>([]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Hi! Send a message and I’ll extract keywords from it (used by the frontend to find relevant info).",
      timestamp: new Date().toISOString(),
    },
  ]);

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

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");

    if (!chatEndpoint) {
      setError("Set VITE_API_BASE to connect the API endpoint.");
      return;
    }

    setLoading(true);

    try {
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

      // Save keywords for your frontend logic
      setKeywords(kws);

      // Show keywords in the chat UI (debug / transparency)
      const assistantText =
        kws.length > 0 ? `Keywords: ${kws.join(", ")}` : "No keywords found.";

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
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
        <h1>Keyword Extractor</h1>
        <p>
          This endpoint returns keywords for each message. Your frontend can use
          them to find relevant information.
        </p>

        {/* Optional: show keyword “chips” outside the chat */}
        {keywords.length > 0 && (
          <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
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
            <article key={message.id} className={`chat-bubble ${message.role}`}>
              <div className="chat-bubble-role">
                {message.role === "assistant" ? "Assistant" : "You"}
              </div>
              <p>{message.content}</p>
            </article>
          ))}

          {loading && (
            <article className="chat-bubble assistant loading">
              <div className="chat-bubble-role">Assistant</div>
              <p>Extracting…</p>
            </article>
          )}
        </div>

        {error && <p className="chat-error">Error: {error}</p>}

        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type a message to extract keywords..."
            aria-label="Chat message"
          />
          <button type="submit" disabled={!canSend}>
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Chatbot;