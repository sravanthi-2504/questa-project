export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

// Helper to extract valid JSON array from Gemini output
function extractJsonArray(text: string): string {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) {
        throw new Error("No valid JSON array found in AI response.");
    }
    return match[0];
}

export async function POST(request: Request) {
    console.log("🚀 VAPI POST ENDPOINT CALLED");

    try {
        const body = await request.json();
        console.log("📦 Incoming Body:", JSON.stringify(body));

        // Extract parameters
        const {
            role = "software engineer",
            level = "mid-level",
            techstack = "JavaScript, React, Node.js",
            amount = "5",
            userid = "vapi-user",
            type = "technical",
        } = body;

        console.log("🎯 Extracted Params:", {
            role,
            level,
            techstack,
            amount,
            userid,
            type,
        });

        // Generate questions with Gemini
        console.log("🤖 Calling Gemini...");
        const { text: questions } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `
                Prepare questions for a job interview.
                Role: ${role}
                Level: ${level}
                Tech stack: ${techstack}
                Focus: ${type}
                Count: ${amount}
                Return ONLY a JSON array like ["Q1","Q2","Q3"]
            `,
        });

        console.log("📘 Raw Gemini Output:", questions);

        // Extract and clean JSON array
        const clean = extractJsonArray(questions);
        console.log("🧼 Clean JSON:", clean);

        const parsedQuestions = JSON.parse(clean);

        // Save to Firebase
        console.log("🔥 Saving to Firebase...");
        await db.collection("interviews").add({
            role,
            type,
            level,
            techstack: techstack.split(",").map((s: string) => s.trim()),
            questions: parsedQuestions,
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        });

        console.log("💾 Saved!");

        // VAPI REQUIRED FORMAT
        return Response.json({
            result: {
                message: `Generated ${amount} interview questions for ${role}`,
                questions: parsedQuestions
            }
        });
    } catch (err: any) {
        console.error("❌ SERVER ERROR:", err);

        return Response.json(
            {
                error: err?.message ?? "Unknown server error",
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return Response.json({
        success: true,
        data: "Thank you!",
    });
}
