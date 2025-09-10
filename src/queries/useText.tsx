
import geminiRequest from "@/apiRequests/gemini";
import { TextPromptType } from "@/lib/schema-validations/audio-prompt.schema";
import { useMutation } from "@tanstack/react-query";

export const useTextMutation = () => {
    return useMutation({
        mutationFn: (body: TextPromptType) => geminiRequest.createText(body),

        onError: (error) => {
            console.error('failed:', error);
            throw new Error(error.message || "Request failed");

        },
        retry: false,
       
    })
}