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
      }}
      onMouseDown={props.onMouseDown}
    >
      <h3 className="p-2 bg-primary/10 rounded-md text-base mb-3">
        {props.vocab.term}
      </h3>
      {props.vocab.partOfSpeech && <span className="font-semibold  my-1 text-sm ">{props.vocab.partOfSpeech}</span>
      }

     {props.vocab.meaningVi &&  <div className='text-sm '>{props.vocab.meaningVi}</div>}
    </div>
  )
}

export default VocabularyItem