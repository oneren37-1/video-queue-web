import React, {useEffect} from 'react';
import {Alert, Button, ButtonGroup, Col, Container, Form} from "react-bootstrap";
import {NavLink, useParams} from "react-router-dom";
import {handleSignal, useAppDispatch, useAppSelector, useWebsocket, useWSAuthedRequest} from "../app/hooks";
import {changeScheduler, setCurrentMedia, setDisplayStatus} from "../store/displays";
import {changeDefaultQueue, loadScheduler} from "../store/scheduler";
import {loadSchedulers} from "../store/schedulers";
import MediaCard from "./MediaCard";
import RenameDisplayModal from "./modals/RenameDisplayModal";

const Display = () => {

    const { id } = useParams();
    const name = useAppSelector((state) => state.displays.displays.find(display => display.id === id)?.name);
    const status = useAppSelector((state) => state.displays.displays.find(display => display.id === id)?.status);

    const [renameModalShow, setRenameModalShow] = React.useState(false);

    const handlePause = () => handleSignal("pause", id)
    const handleResume = () => handleSignal("resume", id)
    const handleNext = () => handleSignal("next", id)
    const handleStop = () => handleSignal("stop", id)
    const handlePlay = () => handleSignal("run", id)
    const handleRestart = () => handleSignal("restart", id)

    const dispatch = useAppDispatch();
    const currMedia = useAppSelector((state) => state.displays.displays.find(d => d.id == id)?.currentMedia);

    useEffect(() => {
        dispatch(loadSchedulers());
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const ws = useWebsocket();
        const handler = (e: any) => {
            const data = JSON.parse(e.data);
            if (data.type === "currMediaChanged") dispatch(setCurrentMedia(data));
            if (data.type === "displayStatusChanged") dispatch(setDisplayStatus(data))
            else return
        }
        ws.addEventListener("message", handler);
        return () => { ws.removeEventListener("message", handler) }
    }, []);

    const schedulerId = useAppSelector((state) => state.displays.displays.find(d => d.id == id)?.scheduler);

    const schedulers = [
        {
            id: "null",
            name: "Без планировщика"
        },
        ...useAppSelector((state) => state.schedulers.schedulers)];

    const getStatusText = (status: string | undefined) => {
        switch (status) {
            case "unknown": return "Статус неизвестен";
            case "offline": return "Недоступен";
            case "stopped": return "Выключен";
            case "playing": return "Работает";
            case "paused": return "На паузе";
            default: return "Статус неизвестен";
        }
    }

    return (
        <div>
            {!id && (
                <h1>Выберите дисплей</h1>
            )}
            {id && (
                <>
                    <h1>
                        {name}
                        {"  "}
                        <Button
                            variant={"outline-secondary"}
                            onClick={() => setRenameModalShow(true)}
                            className={"ml-3"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                <path
                                    d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                            </svg>
                        </Button>
                        <RenameDisplayModal
                            show={renameModalShow}
                            onHide={() => setRenameModalShow(false)}
                            id={id}
                        />
                    </h1>
                    <h3>{getStatusText(status)}</h3>

                    <ButtonGroup size={"lg"}>
                        {status === "paused" && (
                            <Button
                                onClick={handleResume}
                                size="sm" variant="outline-primary" className="pb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-play-fill" viewBox="0 0 16 16">
                                    <path
                                        d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                                </svg>
                            </Button>
                        )}

                        {status === "playing" && (
                            <Button
                                onClick={handlePause}
                                size="sm" variant="outline-primary" className="pb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-pause-fill" viewBox="0 0 16 16">
                                    <path
                                        d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                                </svg>
                            </Button>
                        )}

                        {status === "playing" && (
                            <Button
                                onClick={handleNext}
                                size="sm" variant="outline-secondary" className="pb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-skip-forward-fill" viewBox="0 0 16 16">
                                    <path
                                        d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V8.753l-6.267 3.636c-.54.313-1.233-.066-1.233-.697v-2.94l-6.267 3.636C.693 12.703 0 12.324 0 11.693V4.308c0-.63.693-1.01 1.233-.696L7.5 7.248v-2.94c0-.63.693-1.01 1.233-.696L15 7.248V4a.5.5 0 0 1 .5-.5z"/>
                                </svg>
                            </Button>
                        )}
                        {(status === "playing" || status === "paused") && (
                            <Button
                                onClick={handleStop}
                                size="sm" variant="outline-danger" className="pb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-stop-fill" viewBox="0 0 16 16">
                                    <path
                                        d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/>
                                </svg>
                            </Button>
                        )}
                        {status === "stopped" && (
                            <Button
                                onClick={handlePlay}
                                size="sm" variant="outline-primary" className="pb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-play-fill" viewBox="0 0 16 16">
                                    <path
                                        d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                                </svg>
                            </Button>
                        )}

                        {(status === "playing" || status === "paused") && (
                            <Button
                                onClick={handleRestart}
                                size="sm" variant="outline-primary" className="pb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                          d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                    <path
                                        d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                                </svg>
                            </Button>
                        )}

                    </ButtonGroup>

                    <div
                        style={{
                            maxWidth: "200px",
                            marginTop: "20px"
                        }}
                    >
                        <Col xs="auto">
                            <Form.Select
                                className={"col-sm"}
                                onChange={(e) => {
                                    dispatch(changeScheduler({displayId: id || "", schedulerId: e.target.value}))
                                }}
                                // @ts-ignore
                                value={schedulerId}
                            >
                                {schedulers && schedulers.map(scheduler => (
                                    <option value={scheduler.id || "null"}>{scheduler.name}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </div>

                    {currMedia && (status === "playing" || status === "paused") &&  (
                        <>
                            <h4 className="mt-3">Сейчас играет</h4>

                            <div style={{ maxWidth: "400px" }}>
                                <MediaCard m={currMedia} noEdit />

                                <Alert variant={"light"} className={"mt-2"}>
                                    <span>Из очереди <NavLink to={`/queue/${currMedia.queueId}`}>{currMedia.queueName}</NavLink></span>
                                </Alert>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default Display