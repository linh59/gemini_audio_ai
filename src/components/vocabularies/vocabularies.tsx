'use client'
import VocabularyItem from '@/components/vocabularies/vocabulary-item';
import { VocabulariesProps } from '@/constants/text-type'
import { useDragMove } from '@/hooks/use-drag-move';
import React from 'react'

const Vocabularies = ({ vocabs, onPositionChange, onDelete, onUpdate }: VocabulariesProps) => {
    const { vocabRefs, handleDown } = useDragMove({
        onPositionChange: (id, pos) => onPositionChange(id, pos),
    });


    return (
        <>
            {vocabs?.map(vocab => (
                <VocabularyItem
                    key={vocab.id}
                    domRef={el => {
                        if (vocab.id) {
                            vocabRefs.current[vocab.id] = el
                            
                        }; 
                        if (el) el.classList.add('draggable');
                    }}
                    vocab={vocab}
                    onPointerDown={e => handleDown(vocab, e)}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            ))}
        </>
    );
};

export default Vocabularies;
