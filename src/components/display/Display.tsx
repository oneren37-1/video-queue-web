import React from 'react';
import {Button, ButtonGroup} from "react-bootstrap";

const Display = () => {

    const status: string  = 'ok';

    return (
        <div>
            <h1>\\.\DISPLAY1</h1>
            <ButtonGroup>
                <Button size="sm" variant="outline-primary" className="pb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-play-fill" viewBox="0 0 16 16">
                        <path
                            d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                    </svg>
                </Button>
                <Button size="sm" variant="outline-secondary" className="pb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-skip-forward-fill" viewBox="0 0 16 16">
                        <path
                            d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V8.753l-6.267 3.636c-.54.313-1.233-.066-1.233-.697v-2.94l-6.267 3.636C.693 12.703 0 12.324 0 11.693V4.308c0-.63.693-1.01 1.233-.696L7.5 7.248v-2.94c0-.63.693-1.01 1.233-.696L15 7.248V4a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                </Button>
                <Button size="sm" variant="outline-danger" className="pb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-stop-fill" viewBox="0 0 16 16">
                        <path
                            d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/>
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

            <h4 className="mt-3">Сейчас играет</h4>
            <strong>Видео с котиками</strong><br/>
            <span>Из очереди <a href="#">Очередь добра</a></span>
        </div>
    )
}

export default Display