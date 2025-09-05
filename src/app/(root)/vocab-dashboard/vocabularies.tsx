'use client'
import VocabularyItem from '@/app/(root)/vocab-dashboard/vocabulary-item'
import { VocabItem } from '@/constants/text-type'
import React, {  useEffect, useRef, useState } from 'react'

const Vocabularies = () => {
    const [vocabs, setVocabs] = useState<VocabItem[]>()
    const vocabRefs = useRef<Record<string | number, HTMLDivElement | null>>({});
    const draggingId = useRef<string | number | null>(null);
    const offset = useRef({ x: 0, y: 0 });
    const lastPos = useRef<XY | null>(null) // vị trí mới nhất trong lúc kéo

    useEffect(() => {
        try {
            const vocabLocal = localStorage.getItem('vocab')
            const json = vocabLocal ? JSON.parse(vocabLocal) : []
        
            const updatedVocabularies = json.map((vocab: VocabItem) => {
                if (vocab.position) return vocab
                return { ...vocab, position: determinneNewPosition() }
            })
            setVocabs(updatedVocabularies)
            localStorage.setItem('vocab', JSON.stringify(updatedVocabularies))
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
            const id = draggingId.current
            const p = lastPos.current
            setVocabs(prev => {
                const next = prev.map(v => (v.id === id ? { ...v, position: p } : v))
                try { localStorage.setItem('vocab', JSON.stringify(next)) } catch { }
                return next
            })
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