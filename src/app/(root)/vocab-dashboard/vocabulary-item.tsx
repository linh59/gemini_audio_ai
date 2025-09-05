'use client'
import { VocabItemProps } from '@/constants/text-type'
import React from 'react'


const VocabularyItem = (props: VocabItemProps) => {
  return (
   <div className="clay-card p-6 mt-6"
   ref={props.domRef}
   key={props.vocab.id}
   style={{
     position: 'absolute',
     left: `${props.vocab.position?.x}px`,
     top: `${props.vocab.position?.y}px`,
     cursor: "move",
     width: 300,
     userSelect: 'none'
   } }
   onMouseDown={props.onMouseDown}
   >
        {props.vocab.term} 
    </div>
  )
}

export default VocabularyItem