
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { VocabItem, PositionVocab } from "@/constants/text-type";
import { reloadFromLocal } from "@/lib/redux/features/vocabThunks";


const initialState: VocabItem[] = [];


const vocabSlice = createSlice({
    name: "vocab",
    initialState,
    reducers: {
        GET: (_s, a: PayloadAction<VocabItem[]>) => [...a.payload],

        ADD: (s, a: PayloadAction<VocabItem>) => [...s, a.payload],

        UPDATE_POSITION: (s, a: PayloadAction<{ id: string; position: PositionVocab }>) =>
            s.map(v => (v.id === a.payload.id ? { ...v, position: a.payload.position } : v)),

        UPDATE: (s, a: PayloadAction<{ id: string; data: VocabItem }>) =>
            s.map(v => (v.id === a.payload.id ? { ...v, ...a.payload.data } : v)),

        DELETE: (s, a: PayloadAction<string>) => s.filter(v => v.id !== a.payload),
    },
    extraReducers: (builder) => {
        builder.addCase(reloadFromLocal.pending, (s) => s);
        builder.addCase(reloadFromLocal.fulfilled, (_s, { payload }) => [...payload]);
        builder.addCase(reloadFromLocal.rejected, (s) => s);
    },
});

export const { GET, ADD, UPDATE_POSITION, UPDATE, DELETE } = vocabSlice.actions;
export default vocabSlice.reducer;

// Selector
export const selectVocabs = (state: { vocab: VocabItem[] }) => state.vocab;
