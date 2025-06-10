import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
   const cookieStore=await cookies();
  const token = cookieStore.get('token')?.value;
  console.log(token);

  if (!token) {
    return Response.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; userId: string };
    return Response.json({ success: true, user: decoded });
  } catch (err) {
    return Response.json({ success: false, message: "Invalid token" ,err}, { status: 401 });
  }
}
