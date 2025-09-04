// app/api/echoing/prepare/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const { text, n_easy = 12, n_medium = 14, n_hard = 14 } = await req.json();
        if (!text?.trim()) return NextResponse.json({ message: "Missing text" }, { status: 400 });

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { message: "Missing GOOGLE_API_KEY in env" },
                { status: 500 }
            );
        }

        const ai = new GoogleGenAI({ apiKey });
        const responseSchema = {
            type: "object",
            properties: {
                meta: { type: "object" },
                items: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            level: { type: "string", enum: ["easy", "medium", "hard"] },
                            source: { type: "string" },
                            prompt: { type: "string" },
                            answer: { type: "string" },
                            distractors: { type: "array", items: { type: "string" } },
                            explanationEn: { type: "string" },
                            explanationVi: { type: "string" }
                        },
                        required: ["id", "level", "source", "prompt", "answer"]
                    }
                },
                wordBank: { type: "array", items: { type: "string" } }
            },
            required: ["items"]
        } as const;

        const prompt = `You are an ELT item writer.Return JSON ONLY in this exact shape:

        {
            "meta": {
                "topic": "Actions & Daily Routines",
                    "language": "en-US",
                        "levels": { "easy": ${n_easy}, "medium": ${n_medium}, "hard": ${n_hard} },
                "grading": { "caseInsensitive": true, "trimWhitespace": true }
            },
            "items": [... ],
                "wordBank": [... ]
        }

        CONSTRAINTS & RULES
        1) Remove YouTube - like time stamps[H:]MM:SS or M:SS if any(already mostly cleaned).
2) Use ONLY words / phrases found in the transcript; keep one blank "____" per item.
3) Leveling: easy(basic verbs / objects), medium(common collocations / -ing), hard(rarer collocations / longer).
4) Distractors: exactly 3, same POS, plausible but clearly wrong in context.
5) Explanations: concise EN / VI(≤20 words).

            TRANSCRIPT:
${text}

        CONFIG:
        N_EASY = ${n_easy}, N_MEDIUM = ${n_medium}, N_HARD = ${n_hard}
        `.trim();

        const res = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema
            }
        });

        const data = JSON.parse(res.text ?? "");
        if (!data?.item?.length) return NextResponse.json({ message: "No items generated" }, { status: 502 });

        return NextResponse.json(data, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ message: e?.message ?? "Server error" }, { status: 500 });
    }
}
