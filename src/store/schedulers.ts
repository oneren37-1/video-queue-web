import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {useWSAuthedRequest} from "../app/hooks";

export type Scheduler = {
    id: string;
    name: string;
}
export interface SchedulersState {
    schedulers: Scheduler[];
    status: 'idle' | 'loading' | 'ok' | 'failed';
    postStatus: 'idle' | 'loading' | 'ok' | 'failed';
    deleteStatus: 'idle' | 'loading' | 'ok' | 'failed';
}

const initialState: SchedulersState = {
    schedulers: [],
    status: 'idle',
    postStatus: 'idle',
    deleteStatus: 'idle'
}

export const schedulersSlice = createSlice({
    name: 'schedulers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadSchedulers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadSchedulers.fulfilled, (state, action) => {
                state.status = 'ok';
                state.schedulers = JSON.parse(action.payload.payload);
            })
            .addCase(loadSchedulers.rejected, (state, action) => {
                state.status = 'failed';
                console.log("loadSchedulers.rejected");
                console.log(action.payload)
            })

            .addCase(addScheduler.pending, (state) => {
                state.postStatus = 'loading';
            })
            .addCase(addScheduler.fulfilled, (state, action) => {
                state.postStatus = 'ok';
                state.schedulers.push(action.payload);
            })
            .addCase(addScheduler.rejected, (state, action) => {
                state.postStatus = 'failed';
                console.log("addScheduler.rejected");
                console.log(action.payload)
            })
    }
})

export const loadSchedulers = createAsyncThunk(
    'schedulers/load',
    async (): Promise<any> => {
        return useWSAuthedRequest({
            type: "get",
            entity: "scheduler",
            id: "*"
        })
    }
)

export const addScheduler = createAsyncThunk(
    'schedulers/add',
    async (data: any): Promise<any> => {
        return useWSAuthedRequest({
            type: "post",
            entity: "scheduler",
            payload: JSON.stringify({
                name: data.name,
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

export default schedulersSlice.reducer;