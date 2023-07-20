import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {useWSAuthedRequest} from "../app/hooks";
import {Media} from "./media";

export interface QueuesState {
    id: string;
    name: string;
    items: {
        media: Media,
        priority: number,
    }[];
    status: 'idle' | 'loading' | 'ok' | 'failed';
    updateStatus: 'idle' | 'loading' | 'ok' | 'failed';
    deleteStatus: 'idle' | 'loading' | 'ok' | 'failed';
}

const initialState: QueuesState = {
    id: "",
    name: "",
    items: [],
    status: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
}

export const queueSlice = createSlice({
    name: 'queue',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadQueue.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadQueue.fulfilled, (state, action) => {
                state.status = 'ok';
                const data = action.payload;
                state.id = data.id;
                state.name = data.name;
                state.items = data.items;
            })
            .addCase(loadQueue.rejected, (state, action) => {
                state.status = 'failed';
                console.log("loadQueues.rejected");
                console.log(action.payload)
            })

            .addCase(moveMediaUp.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(moveMediaUp.fulfilled, (state, action) => {
                state.updateStatus = 'ok';
                const mediaId = action.payload;
                let items = [...state.items];
                const item = items.find(item => item.media.id === mediaId);
                if (!item) return;
                const itemPriority = item.priority;
                items = items.map(el => {
                    // @ts-ignore
                    if (el.priority === itemPriority-1) el.priority += 1;
                    // @ts-ignore
                    else if (el.priority === itemPriority) el.priority -= 1;
                    return el;
                }).sort((a, b) => a.priority - b.priority);
                state.items = items;
            })
            .addCase(moveMediaUp.rejected, (state, action) => {
                state.updateStatus = 'failed';
                console.log("upMedia.rejected");
                console.log(action.payload)
            })

            .addCase(moveMediaDown.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(moveMediaDown.fulfilled, (state, action) => {
                state.updateStatus = 'ok';
                const mediaId = action.payload;
                let items = [...state.items];
                const item = items.find(item => item.media.id === mediaId);
                if (!item) return;
                const itemPriority = item.priority;
                items = items.map(el => {
                    // @ts-ignore
                    if (el.priority === itemPriority+1) el.priority -= 1;
                    // @ts-ignore
                    else if (el.priority === itemPriority) el.priority += 1;
                    return el;
                }).sort((a, b) => a.priority - b.priority);
                state.items = items;

            })
            .addCase(moveMediaDown.rejected, (state, action) => {
                state.updateStatus = 'failed';
                console.log("downMedia.rejected");
                console.log(action.payload)
            })

            .addCase(renameQueue.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(renameQueue.fulfilled, (state, action) => {
                state.updateStatus = 'ok';
                state.name = action.payload;
            })
            .addCase(renameQueue.rejected, (state, action) => {
                state.updateStatus = 'failed';
                console.log("renameQueue.rejected");
                console.log(action.payload)
            })

            .addCase(addMediaToQueue.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(addMediaToQueue.fulfilled, (state, action) => {
                state.updateStatus = 'ok';
                const newMedia = action.payload;
                const currCount = state.items.length;
                const newItems = newMedia.map((media: Media, index: number) => {
                    return {
                        media,
                        priority: currCount + index
                    }
                });
                state.items = [...state.items, ...newItems];
            })
            .addCase(addMediaToQueue.rejected, (state, action) => {
                state.updateStatus = 'failed';
                console.log("addMediaToQueue.rejected");
                console.log(action.payload)
            })

            .addCase(removeMedia.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(removeMedia.fulfilled, (state, action) => {
                state.updateStatus = 'ok';
                const mediaId = action.payload;
                state.items = state.items.filter(item => item.media.id !== mediaId);
            })
            .addCase(removeMedia.rejected, (state, action) => {
                state.updateStatus = 'failed';
                console.log("removeMedia.rejected");
                console.log(action.payload)
            })

            .addCase(deleteQueue.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(deleteQueue.fulfilled, (state, action) => {
                state = initialState;
            })
            .addCase(deleteQueue.rejected, (state, action) => {
                state.updateStatus = 'failed';
                console.log("deleteQueue.rejected");
                console.log(action.payload)
            })
    }
})

export const deleteQueue = createAsyncThunk(
    'queue/deleteQueue',
    async (queueId: string): Promise<any> => {
        return useWSAuthedRequest({
            type: "delete",
            entity: "queue",
            id: queueId,
        }).then((res: any) => {
            if (res.payload === "error") throw new Error("Error");
            return queueId;
        })
    })

export const removeMedia = createAsyncThunk(
    'queue/removeMedia',
    async (data: {queueId: string, mediaId: string}): Promise<any> => {
        return useWSAuthedRequest({
            type: "update",
            entity: "queue",
            id: data.queueId,
            payload: JSON.stringify({
                action: "removeMedia",
                mediaId: data.mediaId
            })
        }).then((res: any) => {
            if (res.payload === "error") throw new Error("Error");
            return data.mediaId;
        })
    })

export const addMediaToQueue = createAsyncThunk(
    'queue/addMedia',
    async (data: {queueId: string, mediaIds: string[]}): Promise<any> => {
        console.log(data)
        return useWSAuthedRequest({
            type: "update",
            entity: "queue",
            id: data.queueId,
            payload: JSON.stringify({
                action: "add",
                mediaId: data.mediaIds
            })
        }).then((res: any) => {
            const dataParsed = JSON.parse(res.payload);
            if (!dataParsed.length) throw new Error("No queue found");
            return dataParsed;
        })
    });

export const renameQueue = createAsyncThunk(
    'queue/rename',
    async (data: {id: string, name: string}): Promise<any> => {
        return useWSAuthedRequest({
            type: "update",
            entity: "queue",
            id: data.id,
            payload: JSON.stringify({
                action: "rename",
                name: data.name
            })
        }).then((res: any) => {
            if (res.payload === "error") throw new Error("Error");
            return data.name;
        })
    });

export const loadQueue = createAsyncThunk(
    'queue/load',
    async (id: string): Promise<any> => {
        return useWSAuthedRequest({
            type: "get",
            entity: "queue",
            id: id
        })
            .then((data:any) => {
                const dataParsed = JSON.parse(data.payload);
                if (!dataParsed.length) throw new Error("No queue found");
                const queue = dataParsed[0];

                return {
                    id: queue.id,
                    name: queue.name,
                    items: JSON.parse(queue.items)
                }
            })
    }
)

export const moveMediaUp = createAsyncThunk(
    'queue/upMedia',
    async (data: {queueId: string, mediaId: string}): Promise<any> => {
        return useWSAuthedRequest({
            type: "update",
            entity: "queue",
            id: data.queueId,
            payload: JSON.stringify({
                action: "up",
                mediaId: data.mediaId
            })
        }).then((res: any) => {
            if (res.payload === "error") throw new Error("Error");
            return data.mediaId;
        })
    })

export const moveMediaDown = createAsyncThunk(
    'queue/downMedia',
    async (data: {queueId: string, mediaId: string}): Promise<any> => {
        return useWSAuthedRequest({
            type: "update",
            entity: "queue",
            id: data.queueId,
            payload: JSON.stringify({
                action: "down",
                mediaId: data.mediaId
            })
        }).then((res: any) => {
            if (res.payload === "error") throw new Error("Error");
            return data.mediaId;
        })
    })

export default queueSlice.reducer;