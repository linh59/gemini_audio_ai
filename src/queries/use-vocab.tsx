import { useEffect, useState } from "react";
import type { PositionVocab, VocabItem } from "@/constants/text-type";
import { getVocabsLocal, setVocabsLocal } from "@/lib/utils";


// Hook quản lý vocab trong localStorage -> sau này có thể đổi sang backend -> sẽ dùng Tanstack Query
// Cung cấp API thêm/sửa/xóa vocab
// Mỗi vocab có thêm thuộc tính position
// position được khởi tạo ngẫu nhiên khi thêm mới
export const useVocab = () => {
    // Tạo vị trí ngẫu nhiên (đổi kích thước card cho đúng thực tế)
    function determineNewPosition(): PositionVocab {
        const cardW = 300, cardH = 200;
        const w = typeof window !== "undefined" ? window.innerWidth : 0;
        const h = typeof window !== "undefined" ? window.innerHeight : 0;
        const maxX = Math.max(0, w - cardW);
        const maxY = Math.max(0, h - cardH);
        return { x: Math.floor(Math.random() * maxX), y: Math.floor(Math.random() * maxY) };
    }

    // Bổ sung position nếu thiếu
    function hydrate(list: VocabItem[]): VocabItem[] {
        return list.map(v => (v.position ? v : { ...v, position: determineNewPosition() }));
    }

    // 1) Khởi tạo 1 lần từ localStorage (lazy init)
    const [vocabs, setVocabs] = useState<VocabItem[]>(() => {
        try {
            return hydrate(getVocabsLocal());
        } catch {
            return [];
        }
    });

    // 2) Persist mỗi khi vocabs thay đổi
    useEffect(() => {
        setVocabsLocal(vocabs);
    }, [vocabs]);

    // 3) API
    function reload() {
        setVocabs(hydrate(getVocabsLocal()));
    }
    async function addVocab(data: VocabItem): Promise<boolean> {
        try {
            data.id = 'vocab_0' + (vocabs.length + 1)
            const vocabList = [...vocabs, data]
            setVocabs(vocabList)
            setVocabsLocal(vocabList)
            return true;
        } catch {
            return false;
        }
    }

    function updatePosition(id: string, p: PositionVocab) {
        setVocabs(prev => prev.map(v => (v.id === id ? { ...v, position: p } : v)));
    }

    async function updateVocab(data: VocabItem): Promise<boolean> {
        try {
            setVocabs(prev =>
                prev.map(v =>
                    v.id === data.id
                        ? { ...v, ...data, id: v.id, position: v.position ?? determineNewPosition() }
                        : v
                )
            );
            return true;
        } catch {
            return false;
        }
    }

    async function deleteVocab(id: string): Promise<boolean> {
        try {
            setVocabs(prev => prev.filter(v => v.id !== id));
            return true;
        } catch {
            return false;
        }
    }

    return { vocabs, setVocabs, reload, addVocab, updatePosition, updateVocab, deleteVocab };
};
