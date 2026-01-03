import { useEffect, useRef, useState } from "react";
import api from "../api/api";

export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi 👋 I’m your trading assistant. Ask me about your portfolio, profit, or buying ideas."
    }
  ]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/assistant", { message: input });

      setMessages(prev => [
        ...prev,
        { role: "assistant", text: res.data.reply }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "⚠️ Something went wrong. Try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button className="assistant-fab" onClick={() => setOpen(!open)}>
        🤖
      </button>

      {/* CHAT PANEL */}
      {open && (
        <div className="assistant-panel animate">
          <div className="assistant-header">
            <span>Trading Assistant</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="assistant-body">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="msg assistant typing">
                Typing…
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="assistant-input">
            <input
              placeholder="Ask me anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}
