import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { History } from "@/app/model/History";
import { getUserFromRequest } from "@/app/utils/auth";
export async function POST(req:NextRequest,res:NextResponse){ 
     await connectDB();
    try{
         const user=await getUserFromRequest(req);
         if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

      const { code, 
        language, 
        timeComplexity, 
        spaceComplexity, explanation }=await req.json();

         if (!code || !language) {
      return NextResponse.json(
        { success: false, message: "Missing code or language" },
        { status: 400 }
      );
    }

    const newHistory = new History({
      user: user._id,
      code,
      language,
      timeComplexity,
      spaceComplexity,
      explanation,
    });

    await newHistory.save();


     return NextResponse.json({ success: true, history: newHistory });

    }
    catch(err){
         console.log("save history error:",err)
        return NextResponse.json({success:false,message:"server error"},{status:500});
         
    }
}