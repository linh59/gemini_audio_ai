'use client'
import AddVocabDialog from '@/components/vocabularies/add-vocab-dialog'
import Vocabularies from '@/components/vocabularies/vocabularies'
import { useVocab } from '@/queries/use-vocab'
import React from 'react'

const VocabDashboard = () => {
    const {vocabs, addVocab, updatePosition, updateVocab, deleteVocab} = useVocab()
   

   
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