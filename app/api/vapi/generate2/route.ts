export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

// Extract valid JSON array from Gemini output
function extractJsonArray(text: string): string {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) {
        throw new Error("No valid JSON array found in AI response.");
    }
    return match[0];
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: Request) {
    console.log("🚀 VAPI POST request received");

    try {
        const body = await request.json();
        console.log("📦 Raw request body:", JSON.stringify(body, null, 2));

        // VAPI always sends { parameters: {...} }
        const p = body.parameters || {};

        // Null-safe defaults (very important)
        const role = p.role ?? "software engineer";
        const level = p.level ?? "mid-level";
        const techstack = p.techstack ?? "JavaScript, React, Node.js";
        const amount = p.amount ?? "5";
        const userid = p.userid ?? "vapi-user";
        const type = p.type ?? "technical";

        console.log("🎯 Final Params:", {
            role, level, techstack, amount, userid, type
        });

        // Generate questions using Gemini
        console.log("🤖 Calling Gemini AI...");
        const { text: rawOutput } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `
                Generate exactly ${amount} ${type} interview questions
                for a ${level} ${role} position.

                Tech stack: ${techstack}

                STRICT RULES:
                - Return ONLY a JSON array of strings
                - No markdown, no explanation, no comments
                - Format example: ["Q1", "Q2", "Q3"]
            `,
        });

        console.log("📘 Raw Gemini Output:", rawOutput);

        // Extract JSON
        const cleanJson = extractJsonArray(rawOutput);
        const parsedQuestions = JSON.parse(cleanJson);

        console.log("✅ Parsed Questions:", parsedQuestions);

        // Save to Firebase
        const interviewData = {
            role,
            type,
            level,
            techstack: techstack.split(",").map((s: string) => s.trim()),
            questions: parsedQuestions,
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
            generatedBy: "vapi-tool",
            questionCount: parsedQuestions.length,
        };

        await db.collection("interviews").add(interviewData);
        console.log("🔥 Saved to Firebase");

        // Send VAPI-friendly response
        const response = {
            result: {
                success: true,
                message: `Generated ${parsedQuestions.length} questions for ${role}`,
                questions: parsedQuestions,
                metadata: {
                    role,
                    level,
                    techstack,
                    type,
                    questionCount: parsedQuestions.length,
                    generatedAt: new Date().toISOString(),
                }
            }
        };

        console.log("📤 Sending Final Response");

        return new Response(JSON.stringify(response, null, 2), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
            },
        });

    } catch (error: any) {
        console.error("❌ Server Error:", error);
        return new Response(
            JSON.stringify({ error: error?.message || "Internal Server Error" }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                },
            }
        );
    }
}

// OPTIONS (required for VAPI / browsers)
export async function OPTIONS() {
    return new Response("OK", {
        status: 200,
        headers: {
            ...corsHeaders,
        },
    });
}

// GET (optional debug endpoint)
export async function GET() {
    return new Response(
        JSON.stringify({ message: "Interview Generator API Running" }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
            },
        }
    );
}
