export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

// ---------- JSON CLEANING FUNCTION ----------
function extractJsonArray(text: string) {
    // Remove all markdown code fences
    const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    // Extract ONLY the JSON array
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) {
        throw new Error("No JSON array found in AI output");
    }

    return JSON.parse(match[0]);
}

// ---------- POST HANDLER ----------
export async function POST(request: Request) {
    console.log("🚀 VAPI POST ENDPOINT CALLED");

    try {
        const body = await request.json();
        console.log("📦 Incoming Body:", JSON.stringify(body));

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

        // ---- CALL GEMINI ----
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
                Return ONLY a JSON array like ["Q1", "Q2", "Q3"].
            `,
        });

        console.log("📘 Raw Gemini Output:", questions);

        // ---- CLEAN JSON ----
        const parsedQuestions = extractJsonArray(questions);

        // ---- SAVE TO FIREBASE ----
        const interview = {
            role,
            type,
            level,
            techstack: techstack.split(",").map((s) => s.trim()),
            questions: parsedQuestions,
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        };

        console.log("🔥 Saving to Firebase...");
        await db.collection("interviews").add(interview);

        return Response.json({
            success: true,
            result: `Generated ${amount} interview questions for ${role}`,
        });

    } catch (err: any) {
        console.error("❌ SERVER ERROR:", err);

        return Response.json(
            {
                success: false,
                error: err?.message ?? "Unknown server error",
            },
            { status: 500 }
        );
    }
}

// ---------- GET HANDLER ----------
export async function GET() {
    return Response.json({
        success: true,
        data: "Thank you!",
    });
}
