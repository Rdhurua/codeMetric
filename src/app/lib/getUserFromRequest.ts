import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/app/model/User";
import { connectDB } from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function getUserFromRequest(req: NextRequest) {
    const cookieStore=await cookies();
  const token = cookieStore.get("token")?.value; 

  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    await connectDB();
    const user = await User.findById(decoded.userId); 
    return user;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}
