import React, {useState} from 'react';
import {Button, Card, Col, Form} from 'react-bootstrap';
import ScheduledQueueCard from "../components/ScheduledQueueCard";
import PageLayout from "./PageLayout";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {changeDefaultQueue, loadScheduler} from "../store/scheduler";
import {useParams} from "react-router-dom";
import {loadQueues, Queue} from "../store/queues";

const Scheduler = () => {

    // const queues = [
    //     {
    //         id: 1,
    //         name: "Очередь 1",
    //         cron: "* * * * * * *",
    //         duration: 1000*60*60*2,
    //         date: null
    //     },
    //     {
    //         id: 1,
    //         name: "Очередь 2",
    //         cron: "10-20 10/1 12/1 ? 5/FEB 2-THU 2020-2022",
    //         duration: 1000*60*30,
    //         date: null
    //     },
    //     {
    //         id: 1,
    //         name: "Очередь 3",
    //         cron: null,
    //         duration: 1000*60*60*2,
    //         date: "2023-06-22"
    //     }
    // ]

    const dispatch = useAppDispatch();
    const { id } = useParams();

    React.useEffect(() => {
        dispatch(loadQueues());
        dispatch(loadScheduler(id || ""));
    }, [])

    const name = useAppSelector((state) => state.scheduler.name);
    const queuesNames: Queue[] = [
        {
            id: "null",
            name: "Без заставки",
        },
        ...useAppSelector((state) => state.queues.queues)]

    const queues = useAppSelector((state) => state.scheduler.queues);
    const defaultQueueId = useAppSelector((state) => state.scheduler.defaultQueueId);

    return (
        <PageLayout>
            <h1>{name}</h1>
            {defaultQueueId}
            <h3 className={"mt-5"}>Заставка</h3>
            <div className={"mb-3"}><span>Заставка воспроизводится если нет текущих запланированных очередей</span></div>
            <Col xs="auto">
                <Form.Select
                    className={"col-sm"}
                    onChange={(e) => {
                        dispatch(changeDefaultQueue({id: id || "", queueId: e.target.value}))
                    }}
                    value={defaultQueueId}
                >
                    {queuesNames && queuesNames.map(q => (
                        <option value={q.id || "null"}>{q.name}</option>
                    ))}
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