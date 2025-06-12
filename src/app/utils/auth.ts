import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "../model/User";
import { connectDB } from "../lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "utyrtsksieiiiisk";

export async function getUserFromRequest() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);
    return user || null;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}