
'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller, useForm } from "react-hook-form";
import {  AudioPromptType, MainPromptSchema, MainPromptType, TextPromptType } from "@/lib/schema-validations/audio-prompt.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { GEMINI_TTS_VOICES } from "@/lib/gemini/gemini-voices";
import { toast } from "sonner";
import { AudioFormat, AudioFormatValues } from "@/constants/type";
import { useAudioMutation } from "@/queries/useAudio";
import { useTextMutation } from "@/queries/useText";
import { VocabItem } from "@/constants/text-type";
import VocabTable from "@/app/(root)/prompt-audio/vocab-table";

const MyForm = () => {
    const [vocabLoading, setVocabLoading] = useState(false)
    const [audioLoading, setAudioLoading] = useState(false)
    const [audioUrl, setAudioUrl] = useState<string | undefined>();
    const [vocab, setVocab] = useState<VocabItem[] | undefined>();
    const [audioFormat, setAudioFormat] = useState<string | undefined>();

    const textMutation = useTextMutation()
    const audioMutation = useAudioMutation()
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors }
    } = useForm<MainPromptType>({
        resolver: zodResolver(MainPromptSchema),
        defaultValues: {
            action: "audio",
            text: "",
            voiceName: GEMINI_TTS_VOICES[0],
            audioFormat: AudioFormatValues[0]

        },
    })

    const onSubmit = handleSubmit(async (data: MainPromptType) => {
        if (data.action === 'audio') {
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            const payload: AudioPromptType = {
                text: data.text,
                voiceName: data.voiceName || GEMINI_TTS_VOICES[0],
                audioFormat: data.audioFormat || AudioFormatValues[0]
            }
            onGenerateAudio(payload)
        }

        if (data.action === 'vocab') {
            const payload: TextPromptType = {
                text: data.text,
            }
            onGenerateVocab(payload)
        }

    })
    const onGenerateVocab = async (data: TextPromptType) => {
        setVocabLoading(true)

        try {

            const res = await textMutation.mutateAsync(data)
            setVocab(res.vocab)
            localStorage.setItem('vocab', JSON.stringify(res.vocab))
            toast.success('Created');


        } catch (error: any) {
            toast.error(error?.message.toString() || 'Error');


        } finally {
            setVocabLoading(false)
        }
    }


    const onGenerateAudio = async (data: AudioPromptType) => {
        setAudioLoading(true)

        try {
            const res = await audioMutation.mutateAsync(data)
            const url = URL.createObjectURL(res);
            setAudioUrl(url);
            setAudioFormat(data.audioFormat)
            toast.success('Created');

        } catch (error: any) {
            toast.error(error?.message.toString() || 'Error');

        } finally {
            setAudioLoading(false)
        }

    }




    return (
        <div>
            <div className="clay-card p-6">
                <form className="space-y-4">
                    <div>
                        <Label htmlFor="text">Content</Label>
                        <Textarea id="text" {...register('text')} />
                        {errors.text && <p className="text-red-500 text-sm">{errors.text.message}</p>}
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
                        {errors?.voiceName && <p className="text-red-500 text-sm">{errors.voiceName.message}</p>}

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
                        {errors.audioFormat && <p className="text-red-500 text-sm">{errors.audioFormat.message}</p>}

                    </div>


                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            type="button"
                            className="w-full sm:w-auto"
                            onClick={(e) => {
                                e.preventDefault();
                                setValue("action", "audio", { shouldValidate: false })
                                onSubmit(e)
                            }}
                            disabled={audioLoading}
                        >
                            {audioLoading ? "Generating Audio..." : "Generate Audio"}
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full sm:w-auto"
                            onClick={(e) => {
                                e.preventDefault();
                                setValue("action", "vocab", { shouldValidate: false })
                                onSubmit(e)
                            }}
                            disabled={vocabLoading}
                        >
                            {vocabLoading ? "Generating Vocabulary..." : "Generate Vocabulary"}
                        </Button>
                    </div>

                </form>
            </div>
            {vocab && (
                <div className="clay-card p-6 mt-6">
                    <VocabTable data={vocab} total={vocab.length - 1}  ></VocabTable>
                </div>
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

export default MyForm