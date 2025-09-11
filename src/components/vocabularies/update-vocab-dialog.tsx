
'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { UpdateVocabFormSchema, UpdateVocabFormType } from '@/lib/schema-validations/audio-prompt.schema';
import { toast } from 'sonner';
import { UpdateVocabProps, VocabItem } from '@/constants/text-type';
import clsx from 'clsx';
import { Textarea } from '@/components/ui/textarea';
import { BG_CLASSES } from '@/lib/tailwind/classes';


const UpdateVocabDialog = ({ vocab, onUpdate }: UpdateVocabProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false)
 

    const {
        register,
        handleSubmit,
        reset,
        watch,
        control,
        formState: { errors },
    } = useForm<UpdateVocabFormType>({
        resolver: zodResolver(UpdateVocabFormSchema),
        defaultValues: {
            id: vocab.id,
            term: vocab.term,
            meaningVi: vocab.meaningVi,
            meaningEn: vocab.meaningEn,
            partOfSpeech: vocab.partOfSpeech,
            example: vocab.example,
            color: vocab.color
        }

    });

    const onSubmit = async (data: UpdateVocabFormType) => {
        setLoading(true)
        try {
            const updatedData: VocabItem = {
                id: data.id,
                term: data.term,
                meaningVi: data.meaningVi,
                meaningEn: data.meaningEn,
                partOfSpeech: data.partOfSpeech,
                example: data.example,
                color: data.color
            }
            const res = await onUpdate?.(updatedData)
            if (!res) {
                toast.error('Error');
                return;
            }
            setIsOpen(false)
            toast.success('Updated');
            reset();

        } catch (err) {

            toast.error(err as string);
        }
        finally {
            setLoading(false)

        }
    };
    const colorHex = watch('color')

    useEffect(() => {
        if (isOpen) {
            reset({
                id: vocab.id,
                term: vocab.term,
                meaningVi: vocab.meaningVi,
                meaningEn: vocab.meaningEn,
                partOfSpeech: vocab.partOfSpeech,
                example: vocab.example,
                color: vocab.color
            })
        }
    }, [isOpen, reset])
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="link"
                    size="xs"
                >
                    <Edit2 className="h-4 w-4 text-primary" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Update</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Textarea placeholder="New term (Required)" {...register('term')} />
                            {errors.term && <p className="text-red-500 text-sm">{errors.term.message}</p>}
                        </div>

                        <div>
                            <Textarea placeholder="Meaning VI" {...register('meaningVi')} />
                        </div>
                        <div>
                            <Textarea placeholder="Meaning En" {...register('meaningEn')} />
                        </div>

                        <div>
                            <Textarea placeholder="Example" {...register('example')} />
                        </div>
                        <div className="space-y-3">
                            <Controller
                                control={control}
                                name='color'
                                render={({ field }) => (

                                    <div className="flex gap-2 mb-3">
                                        {BG_CLASSES.map(c => {
                                            const isSelected = field.value === c
                                            return (

                                                <Button
                                                    type='button'
                                                    key={c}
                                                    onClick={() => field.onChange(c)}
                                                    className={[
                                                        'h-7 w-7 rounded border', c,
                                                        isSelected
                                                            ? 'ring-2 ring-black/40 scale-105'
                                                            : 'opacity-85 hover:opacity-100',
                                                        'outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

                                                    ].join(' ')}
                                                    title={c}
                                                />

                                            )

                                        })}
                                    </div>

                                )}
                            />




                            {/* Thẻ dùng Tailwind + biến CSS cho background */}
                            <div
                                className={clsx('clay-card border-none p-6 mt-6 rounded-md', colorHex)}

                            >
                                Content
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Updating...' : 'Update'}
                        </Button>
                    </form>

                </div>
            </DialogContent>
        </Dialog>
    )
}
export default UpdateVocabDialog;