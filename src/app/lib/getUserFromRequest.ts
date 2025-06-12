import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/app/model/User";
import { connectDB } from "@/app/lib/db";

export async function getUserFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Narrow and safely access userId
    const userId = decoded.userId;
    if (!userId) return null;

    await connectDB();
    const user = await User.findById(userId);
    return user;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}
