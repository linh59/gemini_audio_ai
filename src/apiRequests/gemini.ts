import { AudioPromptType } from "@/lib/schema-validations/audio-prompt.schema"

const geminiRequest = {
    createAudio: async (data: AudioPromptType) => {
        const res = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            const e = await res.json().catch(() => ({}));
            throw new Error(e.message || "Request failed");
        }
        return res.blob()
    }
}
export default geminiRequest