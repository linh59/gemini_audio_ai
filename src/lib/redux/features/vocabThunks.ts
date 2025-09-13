import { VocabItem } from "@/constants/text-type";
import { getVocabsLocal } from "@/lib/utils";
import { determineByIndex } from "@/lib/vocab/position";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const reloadFromLocal = createAsyncThunk(
    "vocab/reloadFromLocal",
    async () => {
        const data:VocabItem[] = getVocabsLocal() ?? [];
        return data.map((v, i) => v.position ? v : { ...v, position: determineByIndex(i) });
    });
