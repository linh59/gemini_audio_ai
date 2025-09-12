import { PositionVocab } from "@/constants/text-type"

export const useDeterminePosition = () => {
    const CARD_W = 300;
    const CARD_H = 300;
    const GAP = 16;
    const PADDING = 16;
    const gridCols = () => {
        // chỉ gọi sau mount (client)
        const w = window.innerWidth;
        return Math.max(1, Math.floor((w - PADDING * 2 + GAP) / (CARD_W + GAP)));
    };

    // Tạo vị trí theo index (dùng cho khởi tạo từ localStorage)
    const determineByIndex = (index: number): PositionVocab => {
        const cols = gridCols();
        const col = index % cols;
        const row = Math.floor(index / cols);
        return {
            x: PADDING + col * (CARD_W + GAP),
            y: PADDING + row * (CARD_H + GAP),
        };
    }

    // Tạo vị trí ngẫu nhiên 
    const determineWithoutIndex = (): PositionVocab => {
        const w = typeof window !== "undefined" ? window.innerWidth : 0;
        const h = typeof window !== "undefined" ? window.innerHeight : 0;
        const maxX = Math.max(0, w - CARD_W);
        const maxY = Math.max(0, h - CARD_H);
        return { x: Math.floor(Math.random() * maxX), y: Math.floor(Math.random() * maxY) };
    };

   
    return { determineByIndex, determineWithoutIndex };
}