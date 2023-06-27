import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {useWSAuthedRequest} from "../app/hooks";

export type Queue = {
    id: string;
    name: string;
}
export interface QueuesState {
    queues: Queue[];
    status: 'idle' | 'loading' | 'ok' | 'failed';
    postStatus: 'idle' | 'loading' | 'ok' | 'failed';
}

const initialState: QueuesState = {
    queues: [],
    status: 'idle',
    postStatus: 'idle'
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
            .addCase(addQueue.pending, (state) => {
                state.postStatus = 'loading';
            })
            .addCase(addQueue.fulfilled, (state, action) => {
                state.postStatus = 'ok';
                state.queues.push(action.payload);
            })
            .addCase(addQueue.rejected, (state, action) => {
                state.postStatus = 'failed';
                console.log("addQueue.rejected");
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

export interface IAddQueueProps {
    name: string;
    mediaIds: string[];
}

export const addQueue = createAsyncThunk(
    'queues/add',
    async (data: IAddQueueProps): Promise<any> => {
        return useWSAuthedRequest({
            type: "post",
            entity: "queue",
            payload: JSON.stringify({
                name: data.name,
                mediaIds: data.mediaIds
            })
        }).then((res: any) => {
            const id = res.payload;
            return {
                id: id,
                name: data.name
            }
        })
    }
)

export default queuesSlice.reducer;