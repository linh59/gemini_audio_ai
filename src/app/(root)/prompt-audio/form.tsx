
'use client'
import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller, useForm } from "react-hook-form";
import { AudioPromptSchema, AudioPromptType } from "@/lib/schema-validations/audio-prompt.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { GEMINI_TTS_VOICES } from "@/lib/gemini/geminiVoices";
import { toast } from "sonner";
import { AudioFormat, AudioFormatValues } from "@/constants/type";

const MyForm = () => {
    const [loading, setLoading] = useState(false)
    const [audioUrl, setAudioUrl] = useState<string | undefined>();

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm<AudioPromptType>({
        resolver: zodResolver(AudioPromptSchema),
        defaultValues: {
            voiceName: GEMINI_TTS_VOICES[0],
            audioFormat: AudioFormatValues[0]
        }
    })

    const onSubmit = async (data: AudioPromptType) => {
        console.log(data)
        setLoading(true)
        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const e = await res.json().catch(() => ({}));
                throw new Error(e.message || "Request failed");
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
            toast.success('Created');
            reset()

        } catch (error: any) {
            toast.error(error?.message.toString() || 'Error');


        } finally {
            setLoading(false)
        }
    }

    const audioFormat = watch("audioFormat")



    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="prompt">Prompt</Label>
                    <Textarea id="prompt" {...register('prompt')} />
                    {errors.prompt && <p className="text-red-500 text-sm">{errors.prompt.message}</p>}
                </div>

                <div>
                    <Label htmlFor="voice">Voice</Label>
                    <Controller
                        control={control}
                        name="voiceName"
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger >
                                    <SelectValue placeholder="Select voice" />
                                </SelectTrigger>
                                <SelectContent >
                                    {GEMINI_TTS_VOICES.map((v) => (
                                        <SelectItem key={v} value={v}>
                                            {v}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.voiceName && <p className="text-red-500 text-sm">{errors.voiceName.message}</p>}

                </div>
                 <div>
                    <Label htmlFor="format">Format</Label>
                    <Controller
                        control={control}
                        name="audioFormat"
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger >
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent >
                                    {AudioFormatValues.map((v) => (
                                        <SelectItem key={v} value={v}>
                                            {v}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.voiceName && <p className="text-red-500 text-sm">{errors.voiceName.message}</p>}

                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Loading...' : 'Generate'}
                </Button>
                {audioUrl &&
                    (<div>
                       
                        <audio src={audioUrl} controls className="w-full max-w-xl" />
                        <a
                            href={audioUrl}
                            download= {audioFormat == AudioFormat.mp3 ? "audio_gemini.mp3" : "audio_gemini.wav"}
                            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.99]"
                        >
                            Download ({audioFormat})
                        </a>
                    </div>)
                }

            </form>
        </div>
    )
}

export default MyForm