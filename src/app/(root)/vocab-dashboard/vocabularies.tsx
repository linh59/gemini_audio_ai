'use client'
import VocabularyItem from '@/app/(root)/vocab-dashboard/vocabulary-item'
import { VocabItem, VocabulariesProps, XY } from '@/constants/text-type'
import React, { useRef } from 'react'

const Vocabularies = ({vocabs, onPositionChange}: VocabulariesProps) => {
    const vocabRefs = useRef<Record<string | number, HTMLDivElement | null>>({});
    const draggingId = useRef<string | number | null>(null);
    const offset = useRef<XY>({ x: 0, y: 0 });
    const lastPos = useRef<XY | null>(null) // vị trí mới nhất trong lúc kéo



    const handleDragStart = (vocab: VocabItem, e: React.MouseEvent) => {
        draggingId.current = vocab.id;

        const el = vocabRefs.current[vocab.id];
        if (!el) return;

        const rect = el.getBoundingClientRect();
        offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        lastPos.current = { x: vocab.position?.x ?? 0, y: vocab.position?.y ?? 0 }

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp, { once: true });
    }

    const handleMove = (e: MouseEvent) => {
        const id = draggingId.current;
        if (id == null) return;

        const el = vocabRefs.current[id];
        if (!el) return;

        const newX = e.clientX - offset.current.x;
        const newY = e.clientY - offset.current.y;

        // ✔️ bây giờ mới là DOM node .style
        el.style.left = `${newX}px`;
        el.style.top = `${newY}px`;

        // nhớ lại vị trí để lưu khi mouseup
        lastPos.current = { x: newX, y: newY }
    };

    const handleUp = () => {
        window.removeEventListener("mousemove", handleMove);
        if (draggingId.current != null && lastPos.current) {
            const id = draggingId.current.toString()
            const p = lastPos.current
            onPositionChange(id, p)
           
        }

        draggingId.current = null
        lastPos.current = null
    };


    return (
        <>
            {vocabs?.map(vocab => (
                <>
                    <VocabularyItem
                        domRef={el => { vocabRefs.current[vocab.id] = el; }}
                        vocab={vocab}
                        onMouseDown={e => handleDragStart(vocab, e)}
                    />

                </>
            ))}
        </>
    )



}

export default Vocabularies