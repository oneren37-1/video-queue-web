import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import React, {useMemo} from "react";
import {store} from "./store";
import { v4 as uuidv4 } from 'uuid';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const WSUrl = process.env.REACT_APP_FRONTEND_TYPE == "web" ? 'wss://oneren.space' : 'ws://localhost:6969'

export let WS = new WebSocket(WSUrl);
export const initWS = (ws: WebSocket) => {
    WS.addEventListener('close', () => {
        WS = new WebSocket(WSUrl)
    })
}

initWS(WS)

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

        if (ws.readyState === ws.CONNECTING) {
            ws.addEventListener('open', () => {
                ws.send(JSON.stringify(data));
            });
        }
        else {
            try {
                ws.send(JSON.stringify(data));
            }
            catch (e) {
                // eslint-disable-next-line no-restricted-globals
                location.reload();
            }
        }

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
    const hostId = process.env.REACT_APP_FRONTEND_TYPE == "web" ? state.auth.hostId : "local";
    const hostPassword = process.env.REACT_APP_FRONTEND_TYPE == "web" ? state.auth.password: "local";

    return useWebSocketRequest({
        role: 'client',
        hostID: hostId,
        hostPassword: hostPassword,
        message: data
    });
}

export const handleSignal = (signal: string, id?: string | undefined) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useWSAuthedRequest({
        type: "signal",
        id: id || "",
        signal: signal
    }).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    })
}