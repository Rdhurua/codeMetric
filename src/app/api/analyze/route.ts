import { analyzeCpp } from "@/app/lib/analyzeCpp";
import { analyzeJava } from "@/app/lib/analyzeJava";
import { analyzeJavascript } from "@/app/lib/analyzeJs";
import { analyzePython } from "@/app/lib/analyzePython";
import { connectDB } from "@/app/lib/db";
import { detectLanguageMismatch } from "@/app/lib/detectMismatchLanguage";
import { History } from "@/app/model/History";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/app/lib/getUserFromRequest";


export async function POST(req: NextRequest) {
  try {
    const { code, language,userId } = await req.json();
    console.log(userId);

    if (!code || !language) {
      return NextResponse.json({ error: "Missing input" }, { status: 400 });
    }

    if (detectLanguageMismatch(code, language)) {
      return NextResponse.json({
        success: false,
        warning: ` The code does not look like valid ${language} code.`,
      });
    }

    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let result;
    switch (language) {
      case "javascript":
        result = analyzeJavascript(code);
        break;
      case "python":
        result = analyzePython(code);
        break;
      case "cpp":
        result = analyzeCpp(code);
        break;
      case "java":
        result = analyzeJava(code);
        break;
      default:
        result = {
          time: "Unknown",
          space: "Unknown",
          explanation: "Language not supported yet.",
        };
    }

    await connectDB();

    const newEntry = new History({
      user: user._id, // ✅ Use MongoDB ObjectId reference
      language,
      code,
      timeComplexity: result.time,
      spaceComplexity: result.space,
      explanation: result.explanation,
    });

    await newEntry.save();

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.log("Error in /api/analyze:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
