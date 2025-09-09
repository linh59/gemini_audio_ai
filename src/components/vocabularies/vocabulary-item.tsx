'use client'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import { VocabItemProps } from '@/constants/text-type'
import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'


const VocabularyItem = (props: VocabItemProps) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>()
  const handleDeleteCard = async () => {
    setLoading(true)
    try {
      const res = await props.onDelete?.(props.vocab.id)
      if (!res) {
        toast.error('Failed to delete or item not found')
        return;
      }

      setOpenDialog(false)
      toast.success('Deleted')
    } catch (error) {
      console.log(error)
      toast.error('Delete error')
    } finally {
      setLoading(false)
    }



  }
  return (
    <div className="clay-card border-none bg-primary/30 p-6 mt-6"
      ref={props.domRef}
      key={props.vocab.id}
      style={{
        position: 'absolute',
        left: `${props.vocab.position?.x}px`,
        top: `${props.vocab.position?.y}px`,
        cursor: "move",
        width: 300,
        userSelect: 'none'
      }}
      onMouseDown={props.onMouseDown}
    >
      <h3 className=" font-bold text-xl ">
        {props.vocab.term}
      </h3>
      {props.vocab.partOfSpeech && <div className="mb-3 text-sm ">{props.vocab.partOfSpeech}</div>
      }
      {props.vocab.meaningVi && <div className='text-sm '>{props.vocab.meaningVi}</div>}
      {props.vocab.meaningVi && <div className='text-sm mt-2 italic font-semibold'> "{props.vocab.example}" </div>}

      <div className='mt-2 text-right'>
        <ConfirmDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          title='Confirm Delete'
          description='Are you sure you want to delete this card?'
          trigger={
            <Button
              variant="ghost"
              size="xs"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          }
          onConfirm={handleDeleteCard}
          confirmText='Confirm'
          cancelText='Cancel'
          loading={loading}
        />
      </div>
    </div>
  )
}

export default VocabularyItem