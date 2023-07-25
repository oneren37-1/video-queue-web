import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';

import {useWebsocket, useWebSocketRequest, useWSAuthedRequest} from "../app/hooks";

export type Display = {
    id: string;
    name: string;
    scheduler: string | null;
    status: "unknown" | "offline" | "playing" | "paused" | "stopped"
    currentMedia: {
        name: string;
        id: string;
        queueId: string;
        queueName: string;
        duration: string;
    }
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
        setCurrentMedia(state, action) {
            const { displayId, name, id, queueName, queueId, duration} = action.payload
            const display = state.displays
                .find(display => display.id === displayId);
            if (display) {
                display.currentMedia = { name, id, queueName, queueId, duration };
            }
        },
        setDisplayStatus(state, action) {
            const { displayId, status } = action.payload
            const display = state.displays
                .find(display => display.id === displayId);
            if (display) {
                display.status = status;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadDisplays.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadDisplays.fulfilled, (state, action) => {
                state.status = 'ok';
                state.displays = JSON.parse(action.payload.payload).map((e: any) => {
                    console.log(e)
                    e.currentMedia = JSON.parse(e.currentMedia)
                    return e
                });
            })
            .addCase(loadDisplays.rejected, (state, action) => {
                state.status = 'failed';
                console.log("loadDisplays.rejected");
                console.log(action.payload)
            })
            .addCase(changeScheduler.fulfilled, (state, action) => {
                const {displayId, schedulerId} = action.payload;
                const display = state.displays.find(display => display.id === displayId);
                if (display) {
                    display.scheduler = schedulerId;
                }
            })
    }
})

export const changeScheduler = createAsyncThunk(
    'displays/changeScheduler',
    async (args: {displayId: string, schedulerId: string | null}): Promise<any> => {
        return useWSAuthedRequest({
            type: "update",
            entity: "display",
            id: args.displayId,
            payload: JSON.stringify({
                action: "changeScheduler",
                schedulerId: args.schedulerId
            })
        }).then(() => args)
    })

export const loadDisplays = createAsyncThunk(
    'displays/load',
    async (): Promise<any> => {
        return useWSAuthedRequest({
            type: "get",
            entity: "display",
            id: "*"
        })
    }
)

export const {
    setCurrentMedia,
    setDisplayStatus
} = displaysSlice.actions;
export default displaysSlice.reducer;