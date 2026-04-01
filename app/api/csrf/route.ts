import { NextResponse } from "next/server"
import { randomBytes } from "crypto"

export async function GET() {
  const token = randomBytes(32).toString("hex")
  const res = NextResponse.json({ ok: true })
  res.cookies.set("csrf_token", token, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
    maxAge: 60 * 60 * 4,
  })
  return res
}
