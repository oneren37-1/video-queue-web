import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {useWSAuthedRequest} from "../app/hooks";

export interface LogsState {
    logs: string;
    status: 'idle' | 'loading' | 'ok' | 'failed';
}

const initialState: LogsState = {
    logs: "",
    status: 'idle'
}

export const logsSlice = createSlice({
    name: 'logs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadLogs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadLogs.fulfilled, (state, action) => {
                state.status = 'ok';
                state.logs = action.payload.payload;
            })
            .addCase(loadLogs.rejected, (state, action) => {
                state.status = 'failed';
            })
    }
})

export const loadLogs = createAsyncThunk(
    'logs/load',
    async (): Promise<any> => {
        return useWSAuthedRequest({
            type: "get",
            entity: "logs",
            id: "*"
        })
    }
)

export default logsSlice.reducer;