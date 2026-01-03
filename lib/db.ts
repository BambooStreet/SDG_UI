import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("Missing DATABASE_URL env var");
}

export const sql = neon(url);
