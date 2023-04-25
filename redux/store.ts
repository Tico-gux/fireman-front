import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

import { configureStore } from '@reduxjs/toolkit'
import { api } from './api/api'
import appSlice from './Slices/appSlice'
export const store = configureStore({
    reducer: {
        app: appSlice,
        [api.reducerPath]: api.reducer
    },

    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
