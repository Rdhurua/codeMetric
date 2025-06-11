import { connectDB} from "@/app/lib/db";
import { getUserFromRequest } from "@/app/lib/getUserFromRequest";
import { History } from "@/app/model/History";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const history = await History.create(body);
  return NextResponse.json(history);
}

export async function GET() {
  await connectDB();
      const user = await getUserFromRequest();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  const all = await History.find({user:user._id}).sort({ createdAt: -1 });
  return NextResponse.json(all);
}