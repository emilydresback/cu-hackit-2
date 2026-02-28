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
  const apiBase = import.meta.env.VITE_API_BASE;
  const chatEndpoint =
    import.meta.env.VITE_CHAT_API || (apiBase ? `${apiBase}/chat` : "");

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Hi! I’m your research assistant. Ask me to summarize a topic, compare sources, or find key points in public documents.",
      timestamp: new Date().toISOString(),
    },
  ]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const buildHistoryPayload = (nextUserMessage: ChatMessage) => {
    return [...messages, nextUserMessage].map((message) => ({
      role: message.role,
      content: message.content,
    }));
  };

  const parseAssistantReply = (data: unknown): string => {
    if (!data || typeof data !== "object") {
      return "I couldn’t parse the chatbot response.";
    }

    const response = data as Record<string, unknown>;

    if (typeof response.reply === "string") return response.reply;
    if (typeof response.message === "string") return response.message;
    if (typeof response.answer === "string") return response.answer;
    if (typeof response.output === "string") return response.output;

    if (
      Array.isArray(response.messages) &&
      response.messages.length > 0 &&
      typeof response.messages[response.messages.length - 1] === "object" &&
      response.messages[response.messages.length - 1] !== null
    ) {
      const lastMessage = response.messages[
        response.messages.length - 1
      ] as Record<string, unknown>;

      if (typeof lastMessage.content === "string") {
        return lastMessage.content;
      }
    }

    return "I received a response, but couldn't find assistant text in it.";
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
      setError("Set VITE_CHAT_API or VITE_API_BASE to connect the chatbot endpoint.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(chatEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: buildHistoryPayload(userMessage),
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat request failed with HTTP ${res.status}`);
      }

      const data = await res.json();
      const assistantText = parseAssistantReply(data);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to reach the chatbot service.";
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
        <h1>Research Assistant</h1>
        <p>Chat with your document assistant for summaries, comparisons, and next-step questions.</p>
      </header>

      <div className="chat-shell">
        <div className="chat-messages" role="log" aria-live="polite">
          {messages.map((message) => (
            <article key={message.id} className={`chat-bubble ${message.role}`}>
              <div className="chat-bubble-role">{message.role === "assistant" ? "Assistant" : "You"}</div>
              <p>{message.content}</p>
            </article>
          ))}

          {loading && (
            <article className="chat-bubble assistant loading">
              <div className="chat-bubble-role">Assistant</div>
              <p>Thinking…</p>
            </article>
          )}
        </div>

        {error && <p className="chat-error">Error: {error}</p>}

        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask a research question..."
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
