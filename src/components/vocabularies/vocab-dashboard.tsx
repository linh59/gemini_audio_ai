'use client'
import AddVocabDialog from '@/components/vocabularies/add-vocab-dialog'
import Vocabularies from '@/components/vocabularies/vocabularies'
import { useVocab } from '@/hooks/use-vocab'
import React from 'react'

const VocabDashboard = () => {
    const {vocabs, addVocab, updatePosition, updateVocab, deleteVocab} = useVocab()
   
    // const {vocabs, addVocab, updatePosition, updateVocab, deleteVocab} = useVocabRedux()

   
    return (
        <div>
            <div className=" flex items-center justify-between mb-2">
                <h1 className="title">
                    Vocabulary
                </h1>
                <AddVocabDialog onAddSuccess={addVocab} />
            </div>
            <Vocabularies vocabs={vocabs} onPositionChange={updatePosition} onDelete={deleteVocab} onUpdate={updateVocab}></Vocabularies>
        </div>
    )
}

export default VocabDashboard