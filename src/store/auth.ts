import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';

import {useWebsocket, useWebSocketRequest} from "../app/hooks";

export interface AuthState {
    hostId: string | null;
    password: string | null;
    status: 'idle' | 'loading' | 'ok' | 'failed';
}

const initialState: AuthState = {
    hostId: null,
    password: null,
    status: 'idle',
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'ok';
                state.hostId = action.payload.hostID;
                state.password = action.payload.hostPassword;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
            })
    }
})

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: {hostId: string, hostPassword: string}) => {
        return useWebSocketRequest({
            type: 'connection',
            role: 'client',
            hostID: credentials.hostId,
            hostPassword: credentials.hostPassword
        }).then((data: any) => {
            data.hostID = credentials.hostId;
            data.hostPassword = credentials.hostPassword;
            return data
        });
    }
)

export const { logout } = authSlice.actions;
export default authSlice.reducer;