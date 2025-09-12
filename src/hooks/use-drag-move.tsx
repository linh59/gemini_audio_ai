import { useCallback, useEffect, useRef } from "react";
import type { PositionVocab, VocabItem } from "@/constants/text-type";

type UseDragMoveProps = {
  onPositionChange: (id: string, pos: PositionVocab) => void;
};

export const useDragMove = ({ onPositionChange }: UseDragMoveProps) => {
  const onChangeRef = useRef(onPositionChange);
  useEffect(() => { onChangeRef.current = onPositionChange; }, [onPositionChange]);

  const vocabRefs = useRef<Record<string | number, HTMLDivElement | null>>({});
  const draggingId = useRef<string | number | null>(null);

  const offset = useRef<PositionVocab>({ x: 0, y: 0 });
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const lastDelta = useRef<PositionVocab>({ x: 0, y: 0 });

  const startPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const raf = useRef<number | null>(null);

  const THRESHOLD2 = 9; // 3px ^ 2

  const isInteractive = (el: HTMLElement | null) =>
    !!el?.closest(
      'button, a, input, textarea, select, [contenteditable="true"], [data-no-drag]'
    );

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

    // delta so với gốc
    const dx = absX - startPos.current.x;
    const dy = absY - startPos.current.y;

    // chưa chính thức kéo -> kiểm tra ngưỡng
    if (!isDragging.current) {
      const d2 = (e.clientX - startPointer.current.x) ** 2 + (e.clientY - startPointer.current.y) ** 2;
      if (d2 < THRESHOLD2) return; // coi như click/focus bình thường
      isDragging.current = true;
      el.classList.add("dragging");
    }

    lastDelta.current = { x: dx, y: dy };

    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    });

    // chỉ chặn chọn text/scroll khi đang kéo
    e.preventDefault();
  }, []);

  const finishDrag = useCallback(() => {
    window.removeEventListener("pointermove", handleMove);
    window.removeEventListener("pointerup", finishDrag);
    window.removeEventListener("pointercancel", finishDrag);
    if (raf.current) cancelAnimationFrame(raf.current);

    const id = draggingId.current;
    const dragged = isDragging.current;

    if (id != null && startPos.current) {
      const el = vocabRefs.current[id];
      if (el) {
        if (dragged) {
          const finalLeft = Math.round(startPos.current.x + lastDelta.current.x);
          const finalTop  = Math.round(startPos.current.y + lastDelta.current.y);
          el.style.transform = "";
          el.style.left = `${finalLeft}px`;
          el.style.top  = `${finalTop}px`;
          el.classList.remove("dragging");
          onChangeRef.current?.(String(id), { x: finalLeft, y: finalTop });
        } else {
          // click thuần: dọn style tạm
          el.style.transform = "";
          el.classList.remove("dragging");
        }
      }
    }

    draggingId.current = null;
    startPos.current = null;
    lastDelta.current = { x: 0, y: 0 };
    isDragging.current = false;
  }, [handleMove]);

  const handleDown = useCallback((vocab: VocabItem, e: React.PointerEvent<HTMLElement>) => {
    // nếu click vào phần tử tương tác -> KHÔNG drag
    if (isInteractive(e.target as HTMLElement)) return;

    draggingId.current = vocab.id ?? null;
    const el =  vocab.id ? vocabRefs.current[vocab.id] : null;
    if (!el) return;

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
    startPointer.current = { x: e.clientX, y: e.clientY };
    isDragging.current = false;

    // KHÔNG preventDefault ở đây để inputs nhận focus bình thường
    window.addEventListener("pointermove", handleMove, { passive: false });
    window.addEventListener("pointerup", finishDrag, { once: true });
    window.addEventListener("pointercancel", finishDrag, { once: true });
  }, [handleMove, finishDrag]);

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [handleMove, finishDrag]);

  return { vocabRefs, handleDown };
};
