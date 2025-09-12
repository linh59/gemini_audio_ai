import {  useEffect, useState } from "react";
import type { PositionVocab, VocabItem } from "@/constants/text-type";
import { getVocabsLocal, setVocabsLocal } from "@/lib/utils";
import { useDeterminePosition } from "@/hooks/use-determine-position-index";

export const useVocab = () => {
    const { determineByIndex, determineWithoutIndex } = useDeterminePosition();
    const [vocabs, setVocabs] = useState<VocabItem[]>([]);

    useEffect(() => {
        try {
           reload()
        } catch {
            setVocabs([]);
        } 
    }, []);

    useEffect(() => {
       
        setVocabsLocal(vocabs);
    }, [ vocabs]);

    // API
    const reload = () => {
        const raw = getVocabsLocal();
        const withPos = raw.map((v: VocabItem, i: number) =>
            v.position ? v : { ...v, position: determineByIndex(i) }
        );
        setVocabs(withPos);
    };

    const addVocab = async (data: VocabItem): Promise<boolean> => {
        try {
            const pos = data.position ?? determineWithoutIndex();
            const id = data.id ?? ("vocab_" + (vocabs.length + 1));
            setVocabs(prev => [...prev, { ...data, id, position: pos }]);
            return true;
        } catch { return false; }
    };

    const updatePosition = (id: string, p: PositionVocab) => {
        setVocabs(prev => prev.map(v => (v.id === id ? { ...v, position: p } : v)));
    };

    const updateVocab = async (id: string, data: VocabItem): Promise<boolean> => {
        try {

            setVocabs(prev =>
                prev.map(v =>
                    v.id === id
                        ? { ...v, ...data }
                        : v
                )
            );

            return true;
        } catch { return false; }
    };

    const deleteVocab = async (id: string): Promise<boolean> => {
        try { setVocabs(prev => prev.filter(v => v.id !== id)); return true; }
        catch { return false; }
    };

    return { vocabs, setVocabs, reload, addVocab, updatePosition, updateVocab, deleteVocab };
};
