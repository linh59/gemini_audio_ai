'use-client'
import { PositionVocab, VocabItem } from "@/constants/text-type";
import { ADD, DELETE, selectVocabs, UPDATE, UPDATE_POSITION } from "@/lib/redux/features/vocabSlice";
import { reloadFromLocal } from "@/lib/redux/features/vocabThunks";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { determineWithoutIndex } from "@/lib/vocab/position";
import {  useEffect } from "react";

export const useVocabRedux = () =>{
    const dispatch = useAppDispatch();
    const vocabs = useAppSelector(selectVocabs);

    useEffect(() =>{
        dispatch(reloadFromLocal());
    }, [dispatch]);

    return {
        vocabs,
        reload: () => dispatch(reloadFromLocal()),
        addVocab: async (data: VocabItem): Promise<boolean> =>{
             const pos = data.position ?? determineWithoutIndex();
            const id = data.id ?? ("vocab_" + (vocabs.length + 1));
            dispatch(ADD({...data, id, position: pos}));
            return true;
        },
        updatePosition: (id: string, p: PositionVocab) =>{
            dispatch(UPDATE_POSITION({id, position: p}) );
        
        },
        updateVocab: async (id: string, data: VocabItem) : Promise<boolean> =>{
            dispatch(UPDATE({id, data}))
            return true;
        },
        deleteVocab: async (id: string) : Promise<boolean> =>{
            dispatch(DELETE(id));
            return true;
        }

    }
    
}