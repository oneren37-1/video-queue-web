import React from 'react';
import {Button} from "react-bootstrap";

const Display = () => {

    const status: string  = 'ok';

    return (
        <div>
            <h1>Display</h1>
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