/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller, useForm } from "react-hook-form";
import { AudioPromptSchema, AudioPromptType } from "@/lib/schema-validations/audio-prompt.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { GEMINI_TTS_VOICES } from "@/lib/gemini/gemini-voices";
import { toast } from "sonner";
import { AudioFormat, AudioFormatValues } from "@/constants/type";
import { useAudioMutation } from "@/queries/useAudio";
import { useTextMutation } from "@/queries/useText";
import { TextPromptType, TextPromptSchema } from "@/lib/schema-validations/text-prompt.schema";
import { VocabItem } from "@/constants/text-type";
import VocabTable from "@/app/(root)/prompt-audio/vocab-table";

const DictationForm = () => {
    const [loading, setLoading] = useState(false)
    const textMutation = useTextMutation()
    const audioMutation = useAudioMutation()
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<TextPromptType>({
        resolver: zodResolver(TextPromptSchema),
      
    })

    const onSubmit = async (data: TextPromptType) => {
        setLoading(true)
        try {
            const res = await textMutation.mutateAsync(data)
            await onGenerateAudio({prompt: res.ssml, voiceName: GEMINI_TTS_VOICES[0], audioFormat: AudioFormatValues[0]})
            toast.success('Created');
            reset()

        } catch (error: any) {
            toast.error(error?.message.toString() || 'Error');


        } finally {
            setLoading(false)
        }
    }

     const onGenerateAudio = async (data: AudioPromptType) => {
        try {
            const res = await audioMutation.mutateAsync(data)
            const url = URL.createObjectURL(res);
            setAudioUrl(url);
            setAudioFormat(data.audioFormat)
            // toast.success('Created');
            // reset()

        } catch (error: any) {
            toast.error(error?.message.toString() || 'Error');

        }
        
    }




    return (
        <div>
            <div className="clay-card p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="text">Content</Label>
                        <Textarea id="text" {...register('text')} />
                        {errors.text && <p className="text-red-500 text-sm">{errors.text.message}</p>}
                    </div>

                   
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Loading...' : 'Generate'}
                    </Button>


                </form>
            </div>
            {vocab && (
                <div> <VocabTable data={vocab} total={vocab.length-1} isLoading={loading} ></VocabTable></div>
            )}
            {audioUrl && (<div className="clay-card p-6 mt-6">

                <div>

                    <audio src={audioUrl} controls className="w-full max-w-xl" />
                    <a
                        href={audioUrl}
                        download={audioFormat === AudioFormat.mp3 ? "audio_gemini.mp3" : "audio_gemini.wav"}
                        className="w-full inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-[0.99] mt-4"
                    >
                        Download
                    </a>
                </div>
            </div>)
            }
        </div>
    )
}

export default DictationForm