import { useEffect, useState } from "react";
import type { PositionVocab, VocabItem } from "@/constants/text-type";
import { getVocabsLocal, setVocabsLocal } from "@/lib/utils";

// Hook quản lý vocab trong localStorage -> sau này có thể đổi sang backend -> sẽ dùng Tanstack Query
export const useVocab = () => {
  const CARD_W = 300;
  const CARD_H = 300;
  const GAP = 16;
  const PADDING = 16;

  const gridCols = (): number => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    return Math.max(1, Math.floor((w - PADDING * 2 + GAP) / (CARD_W + GAP)));
  };

  // Trả vị trí cho "thẻ thứ index"
  const determineNewPositionByIndex = (index: number): PositionVocab => {
    const cols = gridCols();
    const col = index % cols;
    const row = Math.floor(index / cols);
    return {
      x: PADDING + col * (CARD_W + GAP),
      y: PADDING + row * (CARD_H + GAP),
    };
  };

  // Tạo vị trí ngẫu nhiên -> giữ lại nếu cần dùng sau
  const determineNewPosition = (): PositionVocab => {
    const cardW = 300, cardH = 300;
    const w = typeof window !== "undefined" ? window.innerWidth : 0;
    const h = typeof window !== "undefined" ? window.innerHeight : 0;
    const maxX = Math.max(0, w - cardW);
    const maxY = Math.max(0, h - cardH);
    return { x: Math.floor(Math.random() * maxX), y: Math.floor(Math.random() * maxY) };
  };

  // Bổ sung position nếu thiếu
  const addPositionToItem = (list: VocabItem[]): VocabItem[] =>
    list.map((v, i) => (v.position ? v : { ...v, position: determineNewPositionByIndex(i) }));

  // 1) Khởi tạo 1 lần từ localStorage (lazy init)
  const [vocabs, setVocabs] = useState<VocabItem[]>(() => {
    try {
      return addPositionToItem(getVocabsLocal());
    } catch {
      return [];
    }
  });

  // 2) Persist mỗi khi vocabs thay đổi
  useEffect(() => {
    setVocabsLocal(vocabs);
  }, [vocabs]);

  // 3) APIs
  const reload = (): void => {
    setVocabs(addPositionToItem(getVocabsLocal()));
  };

  const addVocab = async (data: VocabItem): Promise<boolean> => {
    try {
      const pos = determineNewPositionByIndex(vocabs.length);
      const id = "vocab_0" + (vocabs.length + 1);
      const vocabList = [...vocabs, { ...data, id, position: pos }];
      setVocabs(vocabList);
      return true;
    } catch {
      return false;
    }
  };

  const updatePosition = (id: string, p: PositionVocab): void => {
    setVocabs(prev => prev.map(v => (v.id === id ? { ...v, position: p } : v)));
  };

  const updateVocab = async (data: VocabItem): Promise<boolean> => {
    try {
      setVocabs(prev =>
        prev.map((v, i) =>
          v.id === data.id
            ? { ...v, ...data, id: v.id, position: v.position ?? determineNewPositionByIndex(i) }
            : v
        )
      );
      return true;
    } catch {
      return false;
    }
  };

  const deleteVocab = async (id: string): Promise<boolean> => {
    try {
      setVocabs(prev => prev.filter(v => v.id !== id));
      return true;
    } catch {
      return false;
    }
  };

  return { vocabs, setVocabs, reload, addVocab, updatePosition, updateVocab, deleteVocab };
};
