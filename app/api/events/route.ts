import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.sessionId || !body?.type) {
    return NextResponse.json({ error: "Missing sessionId/type" }, { status: 400 });
  }

  const ts = body.ts ?? new Date().toISOString();
  const payload = body.payload ?? {};

  await sql`
    insert into events (session_id, ts, type, payload)
    values (
      ${body.sessionId}::uuid,
      ${ts}::timestamptz,
      ${body.type},
      ${JSON.stringify(payload)}::jsonb
    )
  `;

  return NextResponse.json({ ok: true as const });
}
