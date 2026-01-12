export async function startSession(params: {
    consentedAt: string;
    ua?: string;
    condition?: string;
    sessionId?: string; // 재시작/복구용
  }): Promise<{ sessionId: string }> {
    const res = await fetch("/api/session/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const message = await res.text().catch(() => null);
      throw new Error(message?.trim() || "Failed to start session");
    }
    return res.json();
  }
  
  export async function logEvent(params: {
    sessionId: string;
    type: string;
    payload?: any;
    ts?: string;
  }): Promise<{ ok: true }> {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const message = await res.text().catch(() => null);
      throw new Error(message?.trim() || "Failed to log event");
    }
    return res.json();
  }
  
