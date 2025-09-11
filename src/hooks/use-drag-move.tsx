// use-drag-move.ts
import { useCallback, useEffect, useRef } from "react";
import type { PositionVocab, VocabItem } from "@/constants/text-type";

type UseDragMoveProps = {
  onPositionChange: (id: string, pos: PositionVocab) => void;
};

export const useDragMove = ({ onPositionChange }: UseDragMoveProps) => {
  const onChangeRef = useRef(onPositionChange);
  useEffect(() => { onChangeRef.current = onPositionChange; }, [onPositionChange]);

  // refs dùng nội bộ
  const vocabRefs = useRef<Record<string | number, HTMLDivElement | null>>({});
  const draggingId = useRef<string | number | null>(null);
  const offset = useRef<PositionVocab>({ x: 0, y: 0 });
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const lastDelta = useRef<PositionVocab>({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  const handleMove = useCallback((e: PointerEvent) => {
    const id = draggingId.current;
    if (id == null || !startPos.current) return;

    const el = vocabRefs.current[id];
    if (!el) return;

    const container = (el.offsetParent as HTMLElement) || document.body;
    const cRect = container.getBoundingClientRect();

    // toạ độ tuyệt đối mong muốn (góc trái) theo container
    const absX = e.clientX - offset.current.x - cRect.left + container.scrollLeft;
    const absY = e.clientY - offset.current.y - cRect.top  + container.scrollTop;

    // chỉ translate theo delta so với gốc
    const dx = absX - startPos.current.x;
    const dy = absY - startPos.current.y;
    lastDelta.current = { x: dx, y: dy };

    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    });

    e.preventDefault();
  }, []);

  const finishDrag = useCallback(() => {
    // dọn listener + rAF
    window.removeEventListener("pointermove", handleMove);
    window.removeEventListener("pointerup", finishDrag);
    window.removeEventListener("pointercancel", finishDrag);
    if (raf.current) cancelAnimationFrame(raf.current);

    const id = draggingId.current;
    if (id != null && startPos.current) {
      const el = vocabRefs.current[id];
      if (el) {
        const finalLeft = Math.round(startPos.current.x + lastDelta.current.x);
        const finalTop  = Math.round(startPos.current.y + lastDelta.current.y);

        el.style.transform = "";
        el.style.left = `${finalLeft}px`;
        el.style.top  = `${finalTop}px`;
        el.classList.remove("dragging");

        onChangeRef.current?.(String(id), { x: finalLeft, y: finalTop });
      }
    }
    draggingId.current = null;
    startPos.current = null;
    lastDelta.current = { x: 0, y: 0 };
  }, [handleMove]);

  const handleDown = useCallback((vocab: VocabItem, e: React.PointerEvent<HTMLElement>) => {
    draggingId.current = vocab.id;
    const el = vocabRefs.current[vocab.id];
    if (!el) return;

    el.classList.add("dragging");

    const container = (el.offsetParent as HTMLElement) || document.body;
    const rect = el.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();

    // điểm bám chuột trong card
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    // gốc vị trí tuyệt đối theo container
    startPos.current = {
      x: rect.left - cRect.left + container.scrollLeft,
      y: rect.top  - cRect.top  + container.scrollTop,
    };
    lastDelta.current = { x: 0, y: 0 };


    window.addEventListener("pointermove", handleMove, { passive: false });
    window.addEventListener("pointerup", finishDrag, { once: true });
    window.addEventListener("pointercancel", finishDrag, { once: true });

    e.preventDefault();
  }, [handleMove, finishDrag]);

  // dọn dẹp nếu unmount giữa lúc đang kéo
  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [handleMove, finishDrag]);

  return {
    vocabRefs,
    handleDown, 
  };
};
