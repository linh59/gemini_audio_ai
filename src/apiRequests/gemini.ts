import { AudioPromptType } from "@/lib/schema-validations/audio-prompt.schema"

const geminiRequest = {
    createAudio: async (data: AudioPromptType) => {
        const res = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            const err: Error = new Error(res.statusText || `HTTP ${res.status}`);
            throw err;
        }
        return res.blob()
    }
}
export default geminiRequest