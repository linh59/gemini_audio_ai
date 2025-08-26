import z from "zod";

export const AudioPromptSchema = z.object({
    prompt: z.string().trim().min(1, {message: "Prompt is required"}),
    voiceName: z.string(),
    audioFormat: z.string()
}).strict()

export type AudioPromptType = z.TypeOf<typeof AudioPromptSchema>

