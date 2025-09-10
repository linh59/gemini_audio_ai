
'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { AddAVocabFormSchema, AddVocabFormType } from '@/lib/schema-validations/audio-prompt.schema';
import { toast } from 'sonner';
import { VocabItem } from '@/constants/text-type';
import { getVocabsLocal, setVocabsLocal } from '@/lib/utils';
import { Input } from '@/components/ui/input';


const AddVocabDialog = ({ onAddSuccess }: { onAddSuccess: () => void }) => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [addLoading, setAddLoading] = useState(false)
    const vocabLocal = getVocabsLocal()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddVocabFormType>({
        resolver: zodResolver(AddAVocabFormSchema),
        defaultValues: {
            meaningVi: '',
            meaningEn: '',
            partOfSpeech: '',
            example: ''
        }

    });

    const onSubmit = async (data: AddVocabFormType) => {
        setAddLoading(true)
        try {
            const newItem: VocabItem = {
                id: 'vocab_0' + (vocabLocal.length + 1),
                term: data.term,
                meaningVi: data.meaningVi,
                meaningEn: data.meaningEn,
                partOfSpeech: data.partOfSpeech,
                example: data.example
            }
            const vocabList = [...vocabLocal, newItem]
            setVocabsLocal(vocabList)
            setIsAddOpen(false)
            toast.success('Added');
            reset();
            onAddSuccess?.();
        } catch (err) {

            toast.error(err as string);
        }
        finally {
            setAddLoading(false)

        }
    };
    return (
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
                <Button >
                    <Plus className="h-4 w-4 mr-2" />
                    Add new
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Add new term</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Input placeholder="New term (Required)" {...register('term')} />
                            {errors.term && <p className="text-red-500 text-sm">{errors.term.message}</p>}
                        </div>

                        <div>
                            <Input placeholder="Meaning VI" {...register('meaningVi')} />
                        </div>
                         <div>
                            <Input placeholder="Meaning En" {...register('meaningEn')} />
                        </div>

                        <div>
                            <Input placeholder="Example" {...register('example')} />
                        </div>


                        <Button type="submit" className="w-full" disabled={addLoading}>
                            {addLoading ? 'Adding...' : 'Add new'}
                        </Button>
                    </form>

                </div>
            </DialogContent>
        </Dialog>
    )
}
export default AddVocabDialog;