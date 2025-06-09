import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.json({ success: true, message: "Logged out" });
  res.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}
