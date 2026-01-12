import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const sessionId: string = body.sessionId ?? randomUUID();
  const consentedAt: string = body.consentedAt ?? new Date().toISOString();
  const gameBackendUrl = process.env.GAME_BACKEND_URL;
  const condition =
    gameBackendUrl == null
      ? (body.condition ?? null)
      : (gameBackendUrl === "http://127.0.0.1:8000" ? "test" : "experiment");

  await sql`
    insert into sessions (session_id, consented_at)
    values (${sessionId}::uuid, ${consentedAt}::timestamptz)
    on conflict (session_id)
    do update set consented_at = excluded.consented_at
  `;

  await sql`
    insert into events (session_id, type, payload)
    values (
      ${sessionId}::uuid,
      'SESSION_STARTED',
      ${JSON.stringify({
        ua: body.ua ?? null,
        condition,
      })}::jsonb
    )
  `;

  return NextResponse.json({ sessionId });
}
