import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import React, {useMemo} from "react";
import {store} from "./store";
import { v4 as uuidv4 } from 'uuid';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const WS = new WebSocket('ws://localhost:6969');
WS.onopen = () => {
    console.log('connected');
};
WS.addEventListener('message', (e) => {
    console.log('message received: ' + e.data);
});
WS.onerror = (e) => {
    console.log('error');
    console.log(e);
};
WS.onclose = (e) => {
    console.log('disconnected');
    console.log(e);
};


export const useWebsocket = () => {
    const ws = WS
    return ws
}

export const useWebSocketRequest = async (data: any) => {
    return new Promise((resolve, reject) => {
        const ws = WS;
        const requestId = uuidv4();

        data.message = data.message || {};
        data.message.requestId = requestId;
        ws.send(JSON.stringify(data));

        const timer = setTimeout(() => {
            reject ('Request timed out');
        }, 5000);

        ws.addEventListener('message', (e) => {
            clearTimeout(timer);
            const data = JSON.parse(e.data);
            if (data.type === 'error') reject(data.message);
            if (data.requestId === requestId) resolve(data);
        });
    });
}

export const useWSAuthedRequest = async (data: any) => {
    const state = store.getState();
    const hostId = state.auth.hostId;
    const hostPassword = state.auth.password;

    return useWebSocketRequest({
        role: 'client',
        hostID: hostId,
        hostPassword: hostPassword,
        message: data
    });
}