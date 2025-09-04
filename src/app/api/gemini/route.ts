/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { clampBitrate, pcmToMp3, pcmToWav } from "@/lib/gemini/gemini-formatter";
import type { AudioPromptType } from "@/lib/schema-validations/audio-prompt.schema";
import { AudioFormat } from "@/constants/type";


export async function POST(req: Request) {
    try {
        const body = (await req.json()) as AudioPromptType | null;
        const prompt = body?.text?.trim();
        const voiceName = body?.voiceName?.trim();
        const audioFormat = body?.audioFormat?.trim();

        if (!prompt) {
            return NextResponse.json({ message: "Missing text" }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { message: "Missing GOOGLE_API_KEY in env" },
                { status: 500 }
            );
        }



        // --- Gọi Gemini ---
        const ai = new GoogleGenAI({ apiKey });
        const audioPrompt = `
      You are a text-to-speech voice. Output AUDIO ONLY.

Speaking rate
- Language: en-US
- Target speaking rate: 100 words per minute (WPM), allow ±5% variation for naturalness.

Rules
1) Sentence segmentation
   - Split the provided text into sentences.
   - Read each sentence exactly once (no added words, no spelling out punctuation).
   - After EACH sentence, insert a hard digital silence whose duration equals the time you just spent speaking that sentence to let learners repeat each sentence.
   - Pace: medium-slow, clear, with pauses between sentences.
   - Voice: warm, natural, inspiring.
   - Use gentle enthusiasm and smile in the tone.

2) Output constraints
   - Audio only. Do not read instructions, labels, or numbers from this prompt.
   - One pass through the text.

Text to voice:
${body?.text}

`.trim();
        const geminiRes = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ role: "user", parts: [{ text: audioPrompt }] }],
            config: {
                responseModalities: ["AUDIO"],
                speechConfig: voiceName
                    ? {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName } },
                    }
                    : undefined,
            },
        });

        const part = geminiRes?.candidates?.[0]?.content?.parts?.[0];
        const base64 = part?.inlineData?.data;

        if (!base64) {
            // Gợi ý: log part để bắt đúng field của SDK đang dùng
            console.error("Gemini returned unexpected shape:", JSON.stringify(part));
            return NextResponse.json(
                { message: "No audio data returned from Gemini" },
                { status: 502 }
            );
        }

        const pcmBuffer = Buffer.from(base64, "base64");
        if (audioFormat === AudioFormat.wav) {
            const wav = pcmToWav(pcmBuffer);

            return new Response(new Uint8Array(wav), {
                headers: {
                    "Content-Type": "audio/wav",
                    "Content-Disposition": 'inline; filename="audio_gemini.wav"',
                    "Cache-Control": "no-store",
                },
            });
        }
        if (audioFormat === AudioFormat.mp3) {
            const kbps = clampBitrate();
            const mp3 = pcmToMp3(pcmBuffer, kbps);
            return new Response(new Uint8Array(mp3), {
                headers: {
                    "Content-Type": "audio/mpeg",
                    "Content-Disposition": 'inline; filename="audio_gemini.mp3"',
                    "Cache-Control": "no-store",
                },
            });

        }
        return NextResponse.json({ message: 'msg' }, { status: 500 });
    } catch (err: any) {
        const msg = err?.statusText || err?.message

        const code = Number.isInteger(err?.status) ? err.status : 500;



        return NextResponse.json({ message: msg }, { status: code });
    }
}
