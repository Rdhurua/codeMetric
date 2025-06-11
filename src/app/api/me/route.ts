import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  const cookieStore = cookies(); // No need to `await` this
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return Response.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;

    // Optional: Validate structure of decoded payload
    if (typeof decoded === 'object' && decoded.email && decoded.userId) {
      return Response.json({ success: true, user: { email: decoded.email, userId: decoded.userId } });
    } else {
      return Response.json({ success: false, message: "Invalid token payload" }, { status: 401 });
    }
  } catch (err) {
    return Response.json({ success: false, message: "Invalid token", error: (err as Error).message }, { status: 401 });
  }
}
