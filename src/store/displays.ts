import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';

import {useWebsocket, useWebSocketRequest, useWSAuthedRequest} from "../app/hooks";

export type Display = {
    id: string;
    name: string;
    schedulerId: string | null;
}
export interface DisplaysState {
    displays: Display[];
    status: 'idle' | 'loading' | 'ok' | 'failed';
}

const initialState: DisplaysState = {
    displays: [],
    status: 'idle'
}

export const displaysSlice = createSlice({
    name: 'displays',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(loadDisplays.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadDisplays.fulfilled, (state, action) => {
                state.status = 'ok';
                state.displays = JSON.parse(action.payload.payload);
            })
            .addCase(loadDisplays.rejected, (state, action) => {
                state.status = 'failed';
                console.log("loadDisplays.rejected");
                console.log(action.payload)
            })
    }
})

export const loadDisplays = createAsyncThunk(
    'auth/load',
    async (): Promise<any> => {
        return useWSAuthedRequest({
            type: "get",
            entity: "display",
            id: "*"
        })
    }
)

// export const { logout } = displaysSlice.actions;
export default displaysSlice.reducer;