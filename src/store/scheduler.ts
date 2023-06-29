import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {Queue} from "./queues";
import {useWSAuthedRequest} from "../app/hooks";

export type SchedeledQueue = {
    id: string;
    queue: Queue;
    priority: number;
    cron: string;
    duration: number;
    emitTime: string;
}

export interface SchedulerState {
    id: string;
    name: string;
    queues: SchedeledQueue[];
    defaultQueue: Queue;
    status: 'idle' | 'loading' | 'ok' | 'failed';
    updateStatus: 'idle' | 'loading' | 'ok' | 'failed';
    deleteStatus: 'idle' | 'loading' | 'ok' | 'failed';
}

const initialState: SchedulerState = {
    id: '',
    name: '',
    queues: [],
    defaultQueue: {
        id: '',
        name: ''
    },
    status: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle'
}

export const queueSlice = createSlice({
    name: 'scheduler',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadScheduler.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadScheduler.fulfilled, (state, action) => {
                state.status = 'ok';
                const data = action.payload;
                state.id = data.id;
                state.name = data.name;
                state.defaultQueue = data.defaultQueue;
                state.queues = data.items;
            })
            .addCase(loadScheduler.rejected, (state, action) => {
                state.status = 'failed';
                console.log("loadQueues.rejected");
                console.log(action.payload)
            })}
})

export const loadScheduler = createAsyncThunk(
    'scheduler/loadScheduler',
    async (id: string): Promise<any> => {
        return useWSAuthedRequest({
            type: "get",
            entity: "scheduler",
            id: id
        })
            .then((data:any) => {
                const dataParsed = JSON.parse(data.payload);
                if (!dataParsed.length) throw new Error("No queue found");
                const scheduler = dataParsed[0];

                return {
                    id: scheduler.id,
                    name: scheduler.name,
                    defaultQueue: scheduler.defaultQueue,
                    items: JSON.parse(scheduler.queues)
                }
            })
    })


export default queueSlice.reducer;