import React, {useEffect} from 'react';
import {Button, ButtonGroup} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector, useWebsocket, useWSAuthedRequest} from "../app/hooks";
import {setCurrentMedia} from "../store/displays";

const Display = () => {

    const status: string  = 'ok';

    const { id } = useParams();
    const name = useAppSelector((state) => state.displays.displays.find(display => display.id === id)?.name);

    const handlePause = () => handleSignal("pause")
    const handleResume = () => handleSignal("resume")
    const handleNext = () => handleSignal("next")
    const handleStop = () => handleSignal("stop")
    const handlePlay = () => handleSignal("run")
    const handleRestart = () => handleSignal("restart")

    const handleSignal = (signal: string) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useWSAuthedRequest({
            type: "signal",
            id: id,
            signal: signal
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        })
    }

    const dispatch = useAppDispatch();
    const currMedia = useAppSelector((state) => state.displays.displays.find(d => d.id == id)?.currentMedia);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const ws = useWebsocket();
        const handler = (e: any) => {
            const data = JSON.parse(e.data);
            if (data.type != "currMediaChanged") return
            dispatch(setCurrentMedia(data))
        }
        ws.addEventListener("message", handler);
        return () => { ws.removeEventListener("message", handler) }
    }, []);

    return (
        <div>
            {!id && (
                <h1>Выберите дисплей</h1>
            )}
            {id && (
                <>
                    <h1>{name}</h1>
                    <ButtonGroup>
                        <Button
                            onClick={handleResume}
                            size="sm" variant="outline-primary" className="pb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-play-fill" viewBox="0 0 16 16">
                                <path
                                    d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                            </svg>
                        </Button>

                        <Button
                            onClick={handlePause}
                            size="sm" variant="outline-primary" className="pb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-pause-fill" viewBox="0 0 16 16">
                                <path
                                    d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                            </svg>
                        </Button>

                        <Button
                            onClick={handleNext}
                            size="sm" variant="outline-secondary" className="pb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-skip-forward-fill" viewBox="0 0 16 16">
                                <path
                                    d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V8.753l-6.267 3.636c-.54.313-1.233-.066-1.233-.697v-2.94l-6.267 3.636C.693 12.703 0 12.324 0 11.693V4.308c0-.63.693-1.01 1.233-.696L7.5 7.248v-2.94c0-.63.693-1.01 1.233-.696L15 7.248V4a.5.5 0 0 1 .5-.5z"/>
                            </svg>
                        </Button>
                        <Button
                            onClick={handleStop}
                            size="sm" variant="outline-danger" className="pb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-stop-fill" viewBox="0 0 16 16">
                                <path
                                    d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/>
                            </svg>
                        </Button>
                        <Button
                            onClick={handlePlay}
                            size="sm" variant="outline-primary" className="pb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-play-fill" viewBox="0 0 16 16">
                                <path
                                    d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                            </svg>
                        </Button>

                        <Button
                            onClick={handleRestart}
                            size="sm" variant="outline-primary" className="pb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                <path
                                    d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                            </svg>
                        </Button>

                    </ButtonGroup>
                    { status !== 'unknown' && (
                        <>
                            <div>Используется <a href="#">Главный планировщик</a></div>
                            <Button className="mt-2" size="sm" variant="outline-secondary">Сменить планировщик</Button>
                        </>
                    )}
                    { status === 'unknown' && (
                        <Button size="sm" variant="primary">Назначить планировщик</Button>
                    )}

                    {currMedia && (
                        <>
                            <h4 className="mt-3">Сейчас играет</h4>
                            <strong>{currMedia.contentName}</strong><br/>
                            <span>Из очереди <a href="#">{currMedia.queueName}</a></span>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default Display