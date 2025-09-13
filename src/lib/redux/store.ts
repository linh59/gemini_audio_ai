import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import vocab, { ADD, DELETE, UPDATE } from "./features/vocabSlice";
import { setVocabsLocal } from '@/lib/utils';
import {  GET, UPDATE_POSITION,  } from "./features/vocabSlice";
import { reloadFromLocal } from '@/lib/redux/features/vocabThunks';

const vocabListener = createListenerMiddleware();

vocabListener.startListening({
  matcher: isAnyOf(GET, ADD, UPDATE_POSITION, UPDATE, DELETE, reloadFromLocal.fulfilled),
  effect: (_, api) => {
    const state = api.getState() as RootState;
    setVocabsLocal(state.vocab);
  },
});

export const store = configureStore({
  reducer: { vocab },
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).prepend(vocabListener.middleware),
  devTools: process.env.NODE_ENV !== "production",
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch