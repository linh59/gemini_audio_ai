
'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AddVocabForm from '@/components/vocabularies/add-vocab-form';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const AddVocabDialog = ({ onAddSuccess }: { onAddSuccess: () => void }) => {
    const [isAddOpen, setIsAddOpen] = useState(false);


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
                    <AddVocabForm onSuccess={() => {
                        setIsAddOpen(false)
                        onAddSuccess?.()
                    }} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default AddVocabDialog;