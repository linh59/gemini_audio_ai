
import geminiRequest from "@/apiRequests/gemini";
import { AudioPromptType } from "@/lib/schema-validations/audio-prompt.schema";
import { useMutation } from "@tanstack/react-query";

export const useAudioMutation = () => {
    return useMutation({
        mutationFn: (body: AudioPromptType) => geminiRequest.createAudio(body),

        onError: (error) => {
            console.error('failed:', error);
            throw new Error(error.message || "Request failed");

        },
        retry: false,
       
    })
}