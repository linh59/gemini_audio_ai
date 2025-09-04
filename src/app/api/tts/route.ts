/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/tts/route.ts
import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { clampBitrate, pcmToMp3, pcmToWav } from "@/lib/gemini/gemini-formatter";

// Quan trọng: dùng Node runtime (không phải Edge)
export const runtime = "nodejs";

/* ===================== CÁC GIÁ TRỊ MẶC ĐỊNH ===================== */
const MODEL_DEFAULT = "gemini-2.5-flash-preview-tts";
const VOICE_DEFAULT = "Kore";



type AudioFormat = "mp3" | "wav";

// Kiểu dữ liệu request (những gì client sẽ gửi lên)
interface SpeakerPair { speaker: string; voiceName: string }
interface TTSRequestBody {
  text: string;                 // bắt buộc
  format?: AudioFormat;         // "mp3" | "wav" (mặc định "mp3")
  model?: string;               // mặc định MODEL_DEFAULT
  voiceName?: string;           // dùng khi KHÔNG multi-speaker
  bitrateKbps?: number;         // chỉ áp dụng khi format=mp3 (24..192)
  // Multi-speaker (preview): hiện tại Gemini yêu cầu CHÍNH XÁC 2 speakers
  // và 2 voices KHÁC NHAU.
  speakers?: SpeakerPair[];
}

/* ===================== HÀM PHỤ TRỢ NHỎ GỌN ===================== */

// Trả JSON error thống nhất
function jsonError(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}




/* ===================== HANDLER CHÍNH ===================== */
/**
 * Body JSON chấp nhận:
 * {
 *   "text": "Alice: Hello\nBob: Hi!",
 *   "format": "mp3" | "wav",
 *   "voiceName": "Kore",           // dùng khi KHÔNG multi-speaker
 *   "bitrateKbps": 96,             // chỉ cho MP3
 *   "speakers": [                  // dùng cho multi-speaker (đúng 2 entries, 2 voices khác nhau)
 *     { "speaker": "Alice", "voiceName": "Puck" },
 *     { "speaker": "Bob",   "voiceName": "Kore" }
 *   ]
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // 1) Đọc body + validate cơ bản
    const body = (await req.json()) as TTSRequestBody;
    if (!body?.text || typeof body.text !== "string") {
      return jsonError("Missing 'text' (string)", 400);
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) return jsonError("Missing GOOGLE_API_KEY in env", 500);

    const format: AudioFormat = body.format === "wav" ? "wav" : "mp3";
    const model = body.model ?? MODEL_DEFAULT;

    // 2) Xây speechConfig cho Gemini
    //    - Single voice: dùng voiceName đơn
    //    - Multi-speaker: (preview) **bắt buộc** chính xác 2 speakers và 2 voices khác nhau
    let speechConfig: any;

    if (Array.isArray(body.speakers)) {
      // Dọn dữ liệu: trim, loại trùng tên, và chỉ giữ 2 đầu tiên
      const map: Record<string, string> = {};
      for (const s of body.speakers) {
        const name = String(s?.speaker ?? "").trim();
        const voice = String(s?.voiceName ?? "").trim() || VOICE_DEFAULT;
        if (name && !(name in map)) map[name] = voice;
      }
      const pairs = Object.entries(map).slice(0, 2); // [[speaker, voice], ...]
      if (pairs.length !== 2) {
        return jsonError(
          `Multi-speaker (preview) yêu cầu CHÍNH XÁC 2 speakers. Bạn gửi ${pairs.length}.`,
          400
        );
      }
      const voiceSet = new Set(pairs.map(([, v]) => v));
      if (voiceSet.size !== 2) {
        return jsonError(
          "Multi-speaker yêu cầu 2 voices KHÁC NHAU (ví dụ: Puck & Kore).",
          400
        );
      }

      speechConfig = {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: pairs.map(([speaker, voiceName]) => ({
            speaker,
            voiceConfig: { prebuiltVoiceConfig: { voiceName } },
          })),
        },
      };
    } else {
      // Single voice
      const voiceName = body.voiceName ?? VOICE_DEFAULT;
      speechConfig = { voiceConfig: { prebuiltVoiceConfig: { voiceName } } };
    }

    // 3) Gọi Gemini để nhận audio PCM (base64)
    const ai = new GoogleGenAI({ apiKey });
    const resp = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: body.text }] }],
      config: {
        responseModalities: ["AUDIO"], // BẮT BUỘC để nhận audio
        speechConfig,
      },
    });

    const base64 = resp.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64) return jsonError("No audio data returned from Gemini", 502);

    // 4) Giải mã base64 -> Buffer PCM
    const pcmBuffer = Buffer.from(base64, "base64");

    // 5) Tuỳ format mà trả về WAV hoặc MP3
    if (format === "wav") {
      const wav = pcmToWav(pcmBuffer);
      return new Response(new Uint8Array(wav), {
        headers: {
          "Content-Type": "audio/wav",
          "Content-Disposition": 'inline; filename="gemini-tts.wav"',
          "Cache-Control": "no-store",
        },
      });
    }

    // MP3
    const kbps = clampBitrate(body.bitrateKbps);
    const mp3 = pcmToMp3(pcmBuffer, kbps);
    return new Response(new Uint8Array(mp3), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'inline; filename="gemini-tts.mp3"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("[/api/tts] Error:", err);
    return jsonError(err?.message ?? "Server error", 500);
  }
}

/* (Tuỳ chọn) Cho phép CORS preflight nếu client ở domain khác */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
