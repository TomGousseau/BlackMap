import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, createToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const valid = await verifyAdmin(username, password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  return res;
}
