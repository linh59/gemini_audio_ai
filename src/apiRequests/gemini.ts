import { VocabItem } from "@/constants/text-type";
import { AudioPromptType, TextPromptType } from "@/lib/schema-validations/audio-prompt.schema"
type EchoingTextResponse = {
    ssml: string;
    vocab: VocabItem[];
};
const geminiRequest = {
    createDictation: async (data: TextPromptType) => {
        const res = await fetch("/api/gemini-dictation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            const err: Error = new Error(res.statusText || `HTTP ${res.status}`);
            throw err;
        }
        const json = (await res.json() as EchoingTextResponse)
        return json
    },
    createText: async (data: TextPromptType) => {
        const res = await fetch("/api/gemini-text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            const err: Error = new Error(res.statusText || `HTTP ${res.status}`);
            throw err;
        }
        const json = (await res.json() as EchoingTextResponse)
        return json
    },

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