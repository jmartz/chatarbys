"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [output, setOutput] = useState("");

  async function send() {
    setOutput("Thinking...");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-chatarbys-secret": process.env.NEXT_PUBLIC_CHATARBYS_SECRET,
      },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setOutput(data.text || "(no response)");
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
