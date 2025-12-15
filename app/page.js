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
  <main style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
    <div style={{ border: "1px solid var(--border)", background: "var(--panel)", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>CHATARBYS POS</div>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>ROASTBEEF v0.1</div>
      </div>

      <div style={{ marginTop: 12, border: "1px solid var(--border)", padding: 12, minHeight: 220, whiteSpace: "pre-wrap" }}>
        {output || "READY. ENTER ORDER / QUESTION."}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
        <textarea
          rows={3}
          style={{
            flex: 1,
            padding: 12,
            background: "transparent",
            color: "var(--fg)",
            border: "1px solid var(--border)",
            outline: "none",
            resize: "vertical",
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type here…"
        />
        <button
          onClick={send}
          disabled={!message.trim()}
          style={{
            width: 160,
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--accent)",
            fontWeight: 700,
            cursor: message.trim() ? "pointer" : "not-allowed",
          }}
        >
          SEND
        </button>
      </div>

      <div style={{ marginTop: 10, color: "var(--muted)", fontSize: 12 }}>
        Tip: ask for “menu-style” answers if you want it more POS-ish.
      </div>
    </div>
  </main>
);
}
