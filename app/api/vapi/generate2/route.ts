export const runtime = "edge";
export const dynamic = "force-dynamic";

// Simple CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET(request: Request) {
    console.log("🔍 GET request received");

    const response = {
        status: "active",
        service: "Interview Question Generator API",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        endpoints: {
            POST: "/api/vapi/generate2 - Generate interview questions"
        }
    };

    return new Response(
        JSON.stringify(response, null, 2),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        }
    );
}

export async function POST(request: Request) {
    console.log("🚀 POST request received");

    try {
        // Parse the request body
        let body;
        try {
            body = await request.json();
            console.log("📦 Request body:", JSON.stringify(body, null, 2));
        } catch (parseError) {
            console.error("❌ JSON parse error:", parseError);
            return new Response(
                JSON.stringify({
                    error: "Invalid JSON in request body"
                }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    }
                }
            );
        }

        // Extract parameters (with VAPI compatibility)
        const params = body.parameters || body;

        const {
            role = "software engineer",
            level = "mid-level",
            techstack = "JavaScript, React, Node.js",
            amount = "5",
            userid = "vapi-user",
            type = "technical",
        } = params;

        console.log("🎯 Parameters:", { role, level, techstack, amount, userid, type });

        // Generate sample questions
        const questionCount = parseInt(amount) || 5;
        const sampleQuestions = [
            `What specific experience do you have with ${techstack} as a ${role}?`,
            `How do you approach ${type} problem-solving as a ${level} ${role}?`,
            `Describe a challenging project where you used ${techstack.split(',')[0]?.trim()}.`,
            `What ${type} methodologies do you follow in your ${role} work?`,
            `How do you stay updated with the latest ${techstack} technologies?`,
            `What's your experience with testing in ${techstack} environments?`,
            `How do you handle code reviews and technical feedback?`,
            `Describe your approach to debugging complex issues in ${techstack}.`
        ].slice(0, questionCount);

        // VAPI-compatible response
        const response = {
            result: {
                success: true,
                message: `Generated ${sampleQuestions.length} ${type} questions for ${level} ${role}`,
                questions: sampleQuestions,
                metadata: {
                    role,
                    level,
                    techstack: techstack.split(',').map((tech: string) => tech.trim()),
                    type,
                    amount: sampleQuestions.length,
                    userId: userid,
                    generatedAt: new Date().toISOString(),
                    // Note: Firebase saving disabled for deployment
                    savedToDatabase: false
                }
            }
        };

        console.log("📤 Sending response:", JSON.stringify(response, null, 2));

        return new Response(
            JSON.stringify(response, null, 2),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            }
        );

    } catch (error: any) {
        console.error("❌ Server error:", error);

        return new Response(
            JSON.stringify({
                error: error?.message || "Internal server error"
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            }
        );
    }
}

// Handle CORS preflight requests
export async function OPTIONS(request: Request) {
    console.log("🛠️ OPTIONS request received");

    return new Response(null, {
        status: 200,
        headers: corsHeaders
    });
}