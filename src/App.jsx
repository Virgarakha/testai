import { useState } from "react";
import axios from "axios";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = { role: "user", content: input };

  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  setLoading(true);

  try {
    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "allenai/molmo-2-8b:free",
        messages: [
          {
            role: "system",
            content: `
Kamu adalah AI yang pemarah, jutek, dan sarkas.
Jawabanmu ketus, nyebelin, tapi tetap benar.
Jangan terlalu panjang.
`
          },
          ...messages,
          userMsg
        ],
      },
      {
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "AI Pemarah"
        },
      }
    );

    const aiMsg = res.data.choices[0].message;
    setMessages((prev) => [...prev, aiMsg]);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={styles.container}>
      <h2>🤖 AI Chatbot</h2>

      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#4f46e5" : "#e5e7eb",
              color: msg.role === "user" ? "#fff" : "#000",
            }}
          >
            {msg.content}
          </div>
        ))}
        {loading && <p>AI lagi mikir...</p>}
      </div>

      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanya apa aja..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={styles.button}>
          Kirim
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "40px auto",
    fontFamily: "sans-serif",
  },
  chatBox: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    border: "1px solid #ddd",
    padding: 10,
    height: 400,
    overflowY: "auto",
    marginBottom: 10,
  },
  message: {
    padding: "8px 12px",
    borderRadius: 8,
    maxWidth: "80%",
  },
  inputBox: {
    display: "flex",
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  button: {
    padding: "10px 16px",
    cursor: "pointer",
  },
};
