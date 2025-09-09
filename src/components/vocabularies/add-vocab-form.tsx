import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { AddAVocabFormSchema, AddVocabFormType } from '@/lib/schema-validations/audio-prompt.schema';
import { toast } from 'sonner';
import { VocabItem } from '@/constants/text-type';


const AddCardForm = ({ onSuccess }: { onSuccess?: () => void }) => {
    const [addLoading, setAddLoading] = useState(false)
    const vocabLocal = localStorage.getItem('vocab')
    const json = vocabLocal ? JSON.parse(vocabLocal) : []

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddVocabFormType>({
        resolver: zodResolver(AddAVocabFormSchema),
       
    });

    const onSubmit = async (data: AddVocabFormType) => {
        setAddLoading(true)
        try {
            const newItem: VocabItem = {
                id: 'vocab_0' + (json.length + 1),
                term: data.term,
                meaningVi: data.meaningVi,
                meaningEn: '',
                partOfSpeech: '',
                example: data.example
            }
            const vocabList = [...json, newItem]
            console.log(vocabList)
            localStorage.setItem('vocab', JSON.stringify(vocabList))
            toast.success('Added');
            reset();
            onSuccess?.();
        } catch (err) {

            toast.error(err as string);
        }
        finally {
            setAddLoading(false)

        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Input placeholder="New term" {...register('term')} />
                {errors.term && <p className="text-red-500 text-sm">{errors.term.message}</p>}
            </div>

            <div>
                <Input placeholder="Meaning VI" {...register('meaningVi')} />
            </div>

            <div>
                <Input placeholder="Example" {...register('example')} />
            </div>


            <Button type="submit" className="w-full" disabled={addLoading}>
                {addLoading ? 'Adding...' : 'Add new'}
            </Button>
        </form>
    );
};

export default AddCardForm;
