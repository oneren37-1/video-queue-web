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
}

const initialState: QueuesState = {
    id: "",
    name: "",
    items: [],
    status: 'idle'
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
    }
})

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

export default queueSlice.reducer;