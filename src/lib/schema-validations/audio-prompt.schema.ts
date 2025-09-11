import { AudioFormatValues } from "@/constants/type";
import z from "zod";

export const AudioPromptSchema = z.object({
  text: z.string().trim().min(1, { message: "This field is required" }),
  voiceName: z.string(),
  audioFormat: z.enum(AudioFormatValues)
}).strict()

export type AudioPromptType = z.TypeOf<typeof AudioPromptSchema>

export const TextPromptSchema = z.object({
  text: z.string().trim().min(1, { message: "CThis fields required" }),
}).strict()

export type TextPromptType = z.TypeOf<typeof TextPromptSchema>


export const MainPromptSchema = z.object({
  action: z.enum(['audio', 'vocab']),
  text: z.string().trim().min(1, { message: "This field is required" }),
  voiceName: z.string().optional(),
  audioFormat: z.enum(AudioFormatValues).optional()
}).superRefine((val, ctx) => {
  if (val.action === 'audio') {
    if (!val.voiceName?.trim()) {
      ctx.addIssue({ code: 'custom', path: ['voiceName'], message: 'Voice is required' });
    }
    if (!val.audioFormat) {
      ctx.addIssue({ code: 'custom', path: ['audioFormat'], message: 'Format is required' });
    }
  }
});

export type MainPromptType = z.TypeOf<typeof MainPromptSchema>

export const AddAVocabFormSchema = z.object({
  term: z.string().trim().min(1, { message: "Term is required" }),
  meaningVi: z.string().optional(),
  meaningEn: z.string().optional(),
  partOfSpeech: z.string().optional(),
  example: z.string().optional()
})

export type AddVocabFormType = z.TypeOf<typeof AddAVocabFormSchema>

export const UpdateVocabFormSchema = z.object({
  id: z.string(),
  term: z.string().trim().min(1, { message: "Term is required" }),
  meaningVi: z.string().optional(),
  meaningEn: z.string().optional(),
  partOfSpeech: z.string().optional(),
  example: z.string().optional(),
  color: z.string().optional()
})

export type UpdateVocabFormType = z.TypeOf<typeof UpdateVocabFormSchema>