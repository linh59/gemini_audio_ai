import { useEffect, useState, useReducer } from "react";
import type { PositionVocab, VocabItem } from "@/constants/text-type";
import { getVocabsLocal, setVocabsLocal } from "@/lib/utils";
import { useDeterminePosition } from "@/hooks/use-determine-position-index";

export const useVocab = () => {
    const { determineByIndex, determineWithoutIndex } = useDeterminePosition();
    // Using useReducer instead of useState for better state management
    // const [vocabs, setVocabs] = useState<VocabItem[]>([]);

    // Define action types for the reducer
    type VocabAction =
        | { type: 'GET'; payload: VocabItem[] }
        | { type: 'ADD'; payload: VocabItem }
        | { type: 'UPDATE_POSITION'; payload: { id: string; position: PositionVocab } }
        | { type: 'UPDATE'; payload: { id: string; data: Partial<VocabItem> } }
        | { type: 'DELETE'; payload: string };

    // Reducer function to handle state changes
    const reducer = (state: VocabItem[], action: VocabAction) => {
        switch (action.type) {
            case 'GET':
                return [...action.payload];
            case 'ADD':
                return [...state, action.payload];
            case 'UPDATE_POSITION':
                return state.map((v: VocabItem) => (v.id === action.payload.id ? { ...v, position: action.payload.position } : v));
            case 'UPDATE':
                return state.map((v: VocabItem) => (v.id === action.payload.id ? { ...v, ...action.payload.data } : v));
            case 'DELETE':
                return state.filter((v: VocabItem) => v.id !== action.payload);
            default:
                return state;
        }
    }
    const [vocabs, dispatch] = useReducer(reducer, [])


    useEffect(() => {
        reload()
    }, []);

    useEffect(() => {
        setVocabsLocal(vocabs);
    }, [vocabs]);

    // API
    const reload = () => {
        const data = getVocabsLocal();
        if(!data || data.length === 0) {
            dispatch({ type: 'GET', payload: [] });
            return;
        }
        const withPos = data.map((v: VocabItem, i: number) =>
            v.position ? v : { ...v, position: determineByIndex(i) }
        );
        dispatch({ type: 'GET', payload: withPos})
    };

    const addVocab = async (data: VocabItem): Promise<boolean> => {
        try {
            const pos = data.position ?? determineWithoutIndex();
            const id = data.id ?? ("vocab_" + (vocabs.length + 1));
            // setVocabs(prev => [...prev, { ...data, id, position: pos }]);
            dispatch({ type: 'ADD', payload: { ...data, id, position: pos } });
            return true;
        } catch { return false; }
    };

    const updatePosition = (id: string, p: PositionVocab) => {
        // setVocabs(prev => prev.map(v => (v.id === id ? { ...v, position: p } : v)));
        dispatch({ type: 'UPDATE_POSITION', payload: { id, position: p } });
    };

    const updateVocab = async (id: string, data: VocabItem): Promise<boolean> => {
        try {

            // setVocabs(prev =>
            //     prev.map(v =>
            //         v.id === id
            //             ? { ...v, ...data }
            //             : v
            //     )
            // );
            dispatch({ type: 'UPDATE', payload: { id, data } });

            return true;
        } catch { return false; }
    };

    const deleteVocab = async (id: string): Promise<boolean> => {
        try { 
            // setVocabs(prev => prev.filter(v => v.id !== id)); 
            dispatch({ type: 'DELETE', payload: id });
            return true; }
        catch { return false; }
    };

    return { vocabs, reload, addVocab, updatePosition, updateVocab, deleteVocab };
};
