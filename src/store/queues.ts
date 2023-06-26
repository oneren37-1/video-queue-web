import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {useWSAuthedRequest} from "../app/hooks";

export type Queue = {
    id: string;
    name: string;
}
export interface QueuesState {
    queues: Queue[];
    status: 'idle' | 'loading' | 'ok' | 'failed';
}

const initialState: QueuesState = {
    queues: [],
    status: 'idle'
}

export const queuesSlice = createSlice({
    name: 'queues',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadQueues.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadQueues.fulfilled, (state, action) => {
                state.status = 'ok';
                state.queues = JSON.parse(action.payload.payload);
            })
            .addCase(loadQueues.rejected, (state, action) => {
                state.status = 'failed';
                console.log("loadQueues.rejected");
                console.log(action.payload)
            })
    }
})

export const loadQueues = createAsyncThunk(
    'queues/load',
    async (): Promise<any> => {
        return useWSAuthedRequest({
            type: "get",
            entity: "queue",
            id: "*"
        })
    }
)

export default queuesSlice.reducer;