// app/api/echoing/prepare/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const { text, wpm = 120, extraPauseSec = 10, language = "en-US", targetVocab = [] } = await req.json();

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
                ssml: { type: "string" },
                vocab: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            term: { type: "string" },
                            partOfSpeech: { type: "string" },
                            meaningEn: { type: "string" },
                            meaningVi: { type: "string" },
                            example: { type: "string" }
                        },
                        required: ["term", "meaningEn", "meaningVi"]
                    }
                },
              
            },
            required: ["ssml", "vocab"]
        } as const;

        const prompt = `
        You are a TTS script writer. Output VALID SSML ONLY (no comments).
Goal: Make an “echoing” practice audio in English (US). Baseline speaking rate: 120 words per minute (${wpm}).

Make SSML for echoing. Rules:
- Wrap the ENTIRE audio in a single <speak>...</speak>.
- Split TEXT into sentences; each sentence in <p>...</p>.
- Insert micro-pause after commas: <break time="250ms" /> when natural.
- After EACH sentence, add echo gap: t_i = ceil((word_count_i / ${wpm})*60 + ${extraPauseSec}) seconds.
- Emit as <break time="t_i s" />
- Emphasize target vocab/collocations by wrapping the exact span:
  <emphasis level="strong"><prosody rate="88%">{span}</prosody></emphasis>.
- Keep language: ${language}. Use the TEXT exactly (no new facts).

Make Vocab Rules:
- target word, phrasal verb, collocations related to topic
- B1-C2 level
- each item including term, partOfSpeech, meaningEn, meaningVi, example

Text to voice exactly (no added facts):
${text}

Return JSON with:
- ssml: a single <speak>...</speak> string including all sentences & breaks.
- vocab: array of {term, partOfSpeech, meaningEn, meaningVi, example}.
- prompt: this prompt sent to api
`.trim();

        const res = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema
            }
        });

        const data = JSON.parse(res.text ?? "{}");
        if (!data?.ssml) return NextResponse.json({ message: "No SSML" }, { status: 502 });

        return NextResponse.json(data, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ message: e?.message ?? "Server error" }, { status: 500 });
    }
}
