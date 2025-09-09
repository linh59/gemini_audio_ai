'use client'
import AddVocabDialog from '@/components/vocabularies/add-vocab-dialog'
import Vocabularies from '@/components/vocabularies/vocabularies'
import { VocabItem, XY } from '@/constants/text-type'
import React, { useEffect, useState } from 'react'

const VocabDashboard = () => {
    const [vocabs, setVocabs] = useState<VocabItem[]>([])

    const getData = () => {
        const vocabLocal = localStorage.getItem('vocab')
        const json = vocabLocal ? JSON.parse(vocabLocal) : []
        console.log(json)
        const updatedVocabularies = json.map((vocab: VocabItem) => {
            if (vocab.position) return vocab
            return { ...vocab, position: determinneNewPosition() }
        })
        setVocabs(updatedVocabularies)
        localStorage.setItem('vocab', JSON.stringify(updatedVocabularies))

    }
    const updatePosition = (id:string, p:XY) =>{
         setVocabs(prev => {
                const next = prev.map(v => (v.id === id ? { ...v, position: p } : v))
                localStorage.setItem('vocab', JSON.stringify(next))
                return next
            })
    }
    useEffect(() => {
        try {
            getData()

        } catch (error) {
            setVocabs([])
        }
    }, [])

    const determinneNewPosition = () => {
        const maxX = window.innerWidth - 250;
        const maxY = window.innerHeight - 250;

        return {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        }
    }
    return (
        <div>
            <div className="mb-4">
                <h1 className="title">
                    Vocabulary
                </h1>
                <AddVocabDialog onAddSuccess={getData} />
            </div>

            <Vocabularies vocabs={vocabs} onPositionChange={updatePosition}></Vocabularies>
        </div>
    )
}

export default VocabDashboard