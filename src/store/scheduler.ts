import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {Queue} from "./queues";
import {useWSAuthedRequest} from "../app/hooks";

export type ScheduledQueue = {
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
    queues: ScheduledQueue[];
    defaultQueueId: string;
    status: 'idle' | 'loading' | 'ok' | 'failed';
    updateStatus: 'idle' | 'loading' | 'ok' | 'failed';
    deleteStatus: 'idle' | 'loading' | 'ok' | 'failed';
}

const initialState: SchedulerState = {
    id: '',
    name: '',
    queues: [],
    defaultQueueId: 'null',
    status: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle'
}

export const schedulerSlice = createSlice({
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
                state.defaultQueueId = data.defaultQueue;
                state.queues = data.items.map((e: any) => {
                    e.duration /= 60;
                    return e;
                });
                state.queues = state.queues.sort((a, b) => {
                    return a.priority - b.priority;
                })
            })
            .addCase(loadScheduler.rejected, (state, action) => {
                state.status = 'failed';
                console.log("loadQueues.rejected");
                console.log(action.payload)
            })

            .addCase(changeDefaultQueue.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(changeDefaultQueue.fulfilled, (state, action) => {
                state.updateStatus = 'ok';
                const data = action.payload;
                state.defaultQueueId = data.id;
            })
            .addCase(changeDefaultQueue.rejected, (state, action) => {
                state.updateStatus = 'failed';
                console.log("changeDefaultQueue.rejected");
                console.log(action.payload)
            })

            .addCase(schedule.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(schedule.fulfilled, (state, action) => {
                state.updateStatus = 'ok';
                const data = action.payload;
                state.queues.forEach((item, index) => {
                    item.priority += 1;
                })

                state.queues.push(data)

                state.queues = state.queues.sort((a, b) => {
                    return a.priority - b.priority;
                })
            })
            .addCase(schedule.rejected, (state, action) => {
                state.updateStatus = 'failed';
                console.log("schedule.rejected");
                console.log(action.payload)
            })
    }
})

export const schedule = createAsyncThunk(
    'scheduler/schedule',
    async (data: any): Promise<any> => {
        return useWSAuthedRequest({
            type: "update",
            entity: "scheduler",
            id: data.id,
            payload: JSON.stringify({
                action: "schedule",
                queue: data.queueId,
                cron: data.cron,
                emitTime: data.date,
                // в минутах
                duration: data.duration
            })
        }).then((res: any) => {
            if (res.payload === "error") throw new Error("Error");
            return {
                id: res.payload,
                cron: data.cron,
                emitTime: data.date,
                duration: data.duration,
                queue: {
                    id: data.queueId,
                    name: data.queueName
                },
                priority: 0
            };
        })
    });

export const changeDefaultQueue = createAsyncThunk(
    'scheduler/changeDefaultQueue',
    async (data: {id: string, queueId: string}): Promise<any> => {
        return useWSAuthedRequest({
            type: "update",
            entity: "scheduler",
            id: data.id,
            payload: JSON.stringify({
                action: "changeDefaultQueue",
                defaultQueue: data.queueId
            })
        }).then((res: any) => {
            if (res.payload === "error") throw new Error("Error");
            return {
                id: data.queueId
            };
        })
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


export default schedulerSlice.reducer;