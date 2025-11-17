export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
    console.log("🚀 VAPI POST ENDPOINT CALLED");

    try {
        const body = await request.json();
        console.log("📦 Incoming RAW Body:", JSON.stringify(body));

        // ⭐ NEW VAPI TOOL FORMAT ⭐
        const { toolName, arguments: args } = body;

        console.log("🔧 Tool name:", toolName);
        console.log("🧩 Tool arguments:", args);

        if (!args) {
            throw new Error("Missing tool arguments");
        }

        const {
            type = "technical",
            role = "software engineer",
            level = "mid-level",
            techstack = "JavaScript, React, Node.js",
            amount = "5",
            userid = "vapi-user"
        } = args;

        console.log("🎯 Extracted parameters:", { type, role, level, techstack, amount, userid });

        // Generate questions with Gemini
        console.log("🤖 Calling Gemini...");
        const { text: questions } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `
                Prepare questions for a job interview.
                The job role is ${role}.
                The job experience level is ${level}.
                The tech stack used is: ${techstack}.
                Focus on: ${type}.
                Number of questions: ${amount}.
                
                Return ONLY a JSON array like:
                ["Q1", "Q2", "Q3"]
            `,
        });

        console.log("📘 Raw generated questions:", questions);

        const interview = {
            role,
            type,
            level,
            techstack: techstack.split(",").map(s => s.trim()),
            questions: JSON.parse(questions),
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        };

        console.log("🔥 Saving to Firebase...");
        await db.collection("interviews").add(interview);

        console.log("💾 Saved!");

        return Response.json({
            success: true,
            result: `I've generated ${amount} interview questions for ${role} role and saved them to your interviews.`
        });

    } catch (error: any) {
        console.error("❌ SERVER ERROR:", error);

        return Response.json({
            success: false,
            error: error?.message ?? "Unknown error"
        }, { status: 500 });
    }
}

export async function GET() {
    return Response.json({
        success: true,
        data: "Thank you!"
    });
}
