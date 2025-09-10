/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/echoing/prepare/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { BG_CLASSES } from "@/lib/tailwind/classes";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text?.trim()) return NextResponse.json({ message: "Missing text" }, { status: 400 });

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { message: "Missing GOOGLE_API_KEY in env" },
                { status: 500 }
            );
        }

        const ai = new GoogleGenAI({ apiKey });
       
        const prompt = `
        Bạn là một trợ lý AI chuyên về luyện thi IELTS. Nhiệm vụ của bạn là phân tích văn bản đầu vào do người dùng cung cấp (thường là transcript các bài nghe hoặc đọc) và trích xuất, hệ thống hóa các thông tin.
        Mong muốn danh sách vocabulary trả ra bao gồm các từ vựng, cụm động từ, cụm danh từ, idiom, collocation liên quan đến chủ để của bài và thường xuyên được dùng trong thật tế và trong thi IELTS
       json
{
  "vocab": [
    {
    "id": "[ID duy nhất, ví dụ: "vocab_001"]",
      "term": "[Từ/Cụm từ/Cụm động từ/Collocation/Idiom 1]",
      "ipa": "[phiên âm theo bảng IPA]"
      "partOfSpeech": "[Loại từ, ví dụ: Noun, Verb, Phrasal Verb, Adjective, Idiom, Collocation]",
      "meaningEn": "[Nghĩa tiếng Anh]",
      "meaningVi": "[Nghĩa tiếng Việt]",
      "example": "[Câu ví dụ từ văn bản hoặc tự tạo, sử dụng từ/cụm từ đó]",
      "color": "[Màu sắc thể hiện sự quan trọng của từ vựng, ví dụ: lấy các màu trong ${BG_CLASSES}
     
    },
    {
    "id": "[ID duy nhất, ví dụ: "vocab_002"]",
      "term": "[Từ/Cụm từ/Cụm động từ/Collocation/Idiom 2]",
      "ipa": "[phiên âm theo bảng IPA]"
      "partOfSpeech": "[Loại từ]",
      "meaningEn": "[Nghĩa tiếng Anh]",
      "meaningVi": "[Nghĩa tiếng Việt]",
      "example": "[Câu ví dụ]",
       "color": "[Màu sắc]"
    }
  ]
}
       
        **Văn bản đầu vào của người dùng:**
        ${text}`.trim();

        const res = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                
            }
        });

        const data = JSON.parse(res.text ?? "{}");
        // if (!data?.ssml) return NextResponse.json({ message: "No SSML" }, { status: 502 });

        return NextResponse.json(data, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ message: e?.message ?? "Server error" }, { status: 500 });
    }
}