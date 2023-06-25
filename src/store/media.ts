import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {useWSAuthedRequest} from "../app/hooks";

export type Media = {
    id: string;
    name: string;
    img: string;
}
export interface MediaState {
    media: Media[];
    status: 'idle' | 'loading' | 'ok' | 'failed';
}

const initialState: MediaState = {
    media: [],
    status: 'idle'
}

export const mediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadMedia.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadMedia.fulfilled, (state, action) => {
                state.status = 'ok';
                state.media = JSON.parse(action.payload.payload);
            })
            .addCase(loadMedia.rejected, (state, action) => {
                state.status = 'failed';
            })
    }
})

export const loadMedia = createAsyncThunk(
    'media/load',
    async (): Promise<any> => {
        return useWSAuthedRequest({
            type: "get",
            entity: "content",
            id: "*"
        })
    }
)

export default mediaSlice.reducer;