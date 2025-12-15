"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [output, setOutput] = useState("");

  async function send() {
  setOutput("");
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-chatarbys-secret": process.env.NEXT_PUBLIC_CHATARBYS_SECRET,
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    setOutput(`Error ${res.status}: ${text || res.statusText}`);
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    setOutput((prev) => prev + decoder.decode(value));
  }
}

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>ChatArbys</h1>

      <textarea
        rows={5}
        style={{ width: "100%", padding: 12 }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me anything..."
      />

      <button
        style={{ marginTop: 12, padding: "10px 14px" }}
        onClick={send}
        disabled={!message.trim()}
      >
        Send
      </button>

      <div
        style={{
          marginTop: 20,
          padding: 12,
          border: "1px solid #ddd",
          whiteSpace: "pre-wrap",
        }}
      >
        {output}
      </div>
    </main>
  );
}
