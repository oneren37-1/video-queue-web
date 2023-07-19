import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {useWSAuthedRequest} from "../app/hooks";

export type Media = {
    id: string;
    name: string;
    img: string;
    duration: number;
    type: 'video' | 'img';
}
export interface MediaState {
    media: Media[];
    status: 'idle' | 'loading' | 'ok' | 'failed';
    updateStatus: 'idle' | 'loading' | 'ok' | 'failed';
}

const initialState: MediaState = {
    media: [],
    status: 'idle',
    updateStatus: 'idle'
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
            .addCase(editMedia.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(editMedia.fulfilled, (state, action) => {
                state.updateStatus = 'ok';
                state.media = state.media.map((media) => {
                    if (media.id === action.payload.id) {
                        media.name = action.payload.name;
                        media.duration = action.payload.duration;
                    }
                    return media;
                })
            })
            .addCase(editMedia.rejected, (state, action) => {
                state.updateStatus = 'failed';
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

export const editMedia = createAsyncThunk(
    'media/edit',
    async (data: any): Promise<any> => {
        return useWSAuthedRequest({
            type: "update",
            entity: "content",
            id: data.id,
            payload: JSON.stringify({
                action: "update",
                name: data.name,
                duration: data.duration,
            })
        }).then(() => data)
    });

export default mediaSlice.reducer;