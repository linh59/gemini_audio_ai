'use client'
import AddVocabDialog from '@/components/vocabularies/add-vocab-dialog'
import Vocabularies from '@/components/vocabularies/vocabularies'
import { VocabItem, PositionVocab } from '@/constants/text-type'
import { UpdateVocabFormType } from '@/lib/schema-validations/audio-prompt.schema'
import { getVocabsLocal, setVocabsLocal } from '@/lib/utils'
import React, { useEffect, useState } from 'react'

const VocabDashboard = () => {
    const [vocabs, setVocabs] = useState<VocabItem[]>([])

    const getData = () => {
        const vocabLocal = getVocabsLocal()
        console.log(vocabLocal)
        const updatedVocabularies = vocabLocal.map((vocab: VocabItem) => {
            if (vocab.position) return vocab
            return { ...vocab, position: determinneNewPosition() }
        })
        setVocabs(updatedVocabularies)
        setVocabsLocal(updatedVocabularies)

    }
    const updatePosition = (id: string, p: PositionVocab) => {
        setVocabs(prev => {
            const next = prev.map(v => (v.id === id ? { ...v, position: p } : v))
            setVocabsLocal(next)

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

    const deleteVocab = async (id: string): Promise<boolean> => {
        try {
            setVocabs((prev) => {
                const deletedVocabs = prev.filter(e => e.id != id)
                setVocabsLocal(deletedVocabs)
                return deletedVocabs
            })
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    const updateVocab = async (data: UpdateVocabFormType): Promise<boolean> => {
        try {
            
            const updatedData: VocabItem = {
                ...data,
                term: data.term,
                meaningEn: data.meaningEn,
                meaningVi: data.meaningVi,
                example: data.example,
                partOfSpeech: data.partOfSpeech,
                color: data.color

            }
            setVocabs(prev => {
                const next = prev.map(v => (v.id === data.id ? { ...v, ...updatedData, id: v.id, position: v.position } : v))
                setVocabsLocal(next)

                return next
            })
            return true;
        } catch (error) {
            return false;
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

            <Vocabularies vocabs={vocabs} onPositionChange={updatePosition} onDelete={deleteVocab} onUpdate={updateVocab}></Vocabularies>
        </div>
    )
}

export default VocabDashboard