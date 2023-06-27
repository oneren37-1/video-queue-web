import React, {useState} from 'react';
import {Button, Card, Col, Form} from 'react-bootstrap';
import ScheduledQueueCard from "../components/queue/ScheduledQueueCard";
import {Cron} from "react-js-cron";
import CronHumanize from "../utils/cronHumanize";
import PageLayout from "./PageLayout";

const Scheduler = () => {

    const queues = [
        {
            id: 1,
            name: "Очередь 1",
            cron: "* * * * * * *",
            duration: 1000*60*60*2,
            date: null
        },
        {
            id: 1,
            name: "Очередь 2",
            cron: "10-20 10/1 12/1 ? 5/FEB 2-THU 2020-2022",
            duration: 1000*60*30,
            date: null
        },
        {
            id: 1,
            name: "Очередь 3",
            cron: null,
            duration: 1000*60*60*2,
            date: "2023-06-22"
        }
    ]


    return (
        <PageLayout>
            <h1>Scheduler</h1>
            <h3 className={"mt-5"}>Заставка</h3>
            <div className={"mb-3"}><span>Заставка воспроизводится если нет текущих запланированных очередей</span></div>
            <Col xs="auto">
                <Form.Select className={"col-sm"}>
                    <option value="1">Очередь 2</option>
                    <option value="2">Очередь 3</option>
                    <option value="3">Очередь 4</option>
                </Form.Select>
            </Col>
            <h3 className="mt-5">Запланированные очереди</h3>
            <div className={"mb-3"}><span>Очереди расположены в соответсвие с приоритетом. В случае, если на одно время запланировано несколько очередей, будет воспроизведена очередь с большим приоритетом</span></div>
            <Button className={"mb-2"}>Запланировать</Button>
            {queues.map((queue: any) => (
                <div className="mb-3"><ScheduledQueueCard {...queue}/></div>
            ))}
        </PageLayout>
    )
}



export default Scheduler