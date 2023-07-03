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

                state.queues.push({
                    id: data.id,
                    queue: {
                        id: data.queueId,
                        name: data.queueName,
                    },
                    priority: 0,
                    cron: data.cron,
                    duration: data.duration,
                    emitTime: data.date
                })

                state.queues = state.queues.sort((a, b) => {
                    return a.priority - b.priority;
                })
            })
            .addCase(schedule.rejected, (state, action) => {
                state.updateStatus = 'failed';
                console.log("schedule.rejected");
                console.log(action.payload)
            })

            .addCase(editSchedule.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(editSchedule.fulfilled, (state, action) => {
                state.updateStatus = 'ok';
                state.queues = state.queues.map(q => {
                    if (q.id === action.payload.itemId) {
                        q.cron = action.payload.cron;
                        q.duration = action.payload.duration;
                        q.emitTime = action.payload.date;
                    }
                    return q
                })
            })
            .addCase(editSchedule.rejected, (state, action) => {
                state.updateStatus = 'failed';
                console.log("editSchedule.rejected");
                console.log(action.payload)
            })
            .addCase(dropQueue.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(dropQueue.fulfilled, (state, action) => {
                state.updateStatus = 'ok';
                const item = state.queues.find(q => q.id === action.payload.itemId);
                state.queues = state.queues.map(q => {
                    if (item && q.priority > item.priority) q.priority -= 1;
                    return q
                }).filter(q => q.id !== action.payload.itemId);
            })
            .addCase(dropQueue.rejected, (state, action) => {
                state.updateStatus = 'failed';
                console.log("dropQueue.rejected");
                console.log(action.payload)
            })
            .addCase(upQueue.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(upQueue.fulfilled, (state, action) => {
                state.updateStatus = 'ok';
                const item = state.queues.find(q => q.id === action.payload.itemId);
                state.queues = state.queues.map(q => {
                    if (q.id === action.payload.itemId) {
                        q.priority -= 1;
                    } else if (item && q.priority === item.priority - 1) {
                        q.priority += 1;
                    }
                    return q
                })
                state.queues = state.queues.sort((a, b) => {
                    return a.priority - b.priority;
                })
            })
            .addCase(upQueue.rejected, (state, action) => {
                state.updateStatus = 'failed';
                console.log("upQueue.rejected");
                console.log(action.payload)
            })
            .addCase(downQueue.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(downQueue.fulfilled, (state, action) => {
                state.updateStatus = 'ok';
                const item = state.queues.find(q => q.id === action.payload.itemId);
                const p = item?.priority || 0;
                state.queues = state.queues.map(q => {
                    if (+q.priority === p+1) {
                        q.priority -= 1;
                    } else if (q.id === action.payload.itemId) {
                        q.priority += 1;
                    }
                    return q
                })
                state.queues = state.queues.sort((a, b) => {
                    return a.priority - b.priority;
                })
            })
            .addCase(downQueue.rejected, (state, action) => {
                state.updateStatus = 'failed';
                console.log("downQueue.rejected");
                console.log(action.payload)
            })
    }
})

export const upQueue = createAsyncThunk(
    'scheduler/upQueue',
    async (data: any): Promise<any> => {
        return useWSAuthedRequest({
            type: "update",
            entity: "scheduler",
            id: data.id,
            payload: JSON.stringify({
                action: "upQueue",
                itemId: data.itemId
            })
        }).then((res: any) => {
            if (res.payload === "error") throw new Error("Error");
            return data;
        })
    });

export const downQueue = createAsyncThunk(
    'scheduler/downQueue',
    async (data: any): Promise<any> => {
        return useWSAuthedRequest({
            type: "update",
            entity: "scheduler",
            id: data.id,
            payload: JSON.stringify({
                action: "downQueue",
                itemId: data.itemId
            })
        }).then((res: any) => {
            if (res.payload === "error") throw new Error("Error");
            return data;
        })
    });

export const dropQueue = createAsyncThunk(
    'scheduler/dropQueue',
    async (data: any): Promise<any> => {
        return useWSAuthedRequest({
            type: "update",
            entity: "scheduler",
            id: data.id,
            payload: JSON.stringify({
                action: "dropQueue",
                itemId: data.itemId
            })
        }).then((res: any) => {
            if (res.payload === "error") throw new Error("Error");
            return data;
        })
    });

export const editSchedule = createAsyncThunk(
    'scheduler/editSchedule',
    async (data: any): Promise<any> => {
        return useWSAuthedRequest({
            type: "update",
            entity: "scheduler",
            id: data.id,
            payload: JSON.stringify({
                action: "editSchedule",
                itemId: data.itemId,
                cron: data.cron,
                emitTime: data.date,
                // в минутах
                duration: data.duration
            })
        }).then((res: any) => {
            if (res.payload === "error") throw new Error("Error");
            return data;
        })
    });

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
            data.id = res.payload;
            return data;
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