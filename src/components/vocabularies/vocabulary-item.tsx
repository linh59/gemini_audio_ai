'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import UpdateVocabDialog from '@/components/vocabularies/update-vocab-dialog'
import { VocabItemProps } from '@/constants/text-type'
import clsx from 'clsx'
import { Pin, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'


const VocabularyItem = (props: VocabItemProps) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>()
  const handleDeleteCard = async () => {
    setLoading(true)
    try {
      if(!props.vocab.id) {
        toast.error('Item not found')
        return;
      }
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
    <div
      className={clsx('draggable clay-card group  border-none p-6 mt-0 rounded-xl', props.vocab.color)}
      ref={props.domRef}
      key={props.vocab.id}
      style={{
        left: `${props.vocab.position?.x}px`,
        top: `${props.vocab.position?.y}px`,
      }}
      onPointerDown={props.onPointerDown}
    >
      <Pin className='absolute top-3 right-3 text-primary transition-transform rotate-30' size='20'></Pin>



      <h3 className=" font-semibold text-xl whitespace-pre-wrap break-words">
        {props.vocab.term}
      </h3>
      {props.vocab.ipa && <div className="mb-3 text-sm ">{props.vocab.ipa}</div>}

      {props.vocab.meaningVi && <div className='text-sm whitespace-pre-wrap break-words'>{props.vocab.meaningVi}</div>}
      {props.vocab.meaningVi && <div className='text-sm mt-2 italic font-semibold whitespace-pre-wrap break-words'> {props.vocab.example}</div>}

      <div className='mt-2 flex justify-between items-end'>
        <div>
          {props.vocab.partOfSpeech && <Badge variant='secondary' size='sm'>{props.vocab.partOfSpeech}</Badge>}

        </div>
        
        <div className="
      absolute bottom-3 right-3 flex items-center gap-1
      opacity-0 pointer-events-none
      group-hover:opacity-100 group-hover:pointer-events-auto
      group-focus-within:opacity-100
      transition-opacity duration-150
      md:opacity-0 md:group-hover:opacity-100
      z-100
    " >
          <UpdateVocabDialog  vocab={props.vocab} onUpdate={props.onUpdate} />

          <ConfirmDialog  
            open={openDialog}
            onOpenChange={setOpenDialog}
            title='Confirm Delete'
            description='Are you sure you want to delete this card?'
            trigger={
              <Button
                variant="link"
                size="xs"
              >
                <Trash2 className="h-4 w-4 text-orange-600" />
              </Button>
            }
            onConfirm={handleDeleteCard}
            confirmText='Confirm'
            cancelText='Cancel'
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}

export default VocabularyItem