import React, {useState} from 'react';
import {Button, Card, Col, Form} from 'react-bootstrap';
import ScheduledQueueCard from "../components/ScheduledQueueCard";
import PageLayout from "./PageLayout";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {changeDefaultQueue, loadScheduler} from "../store/scheduler";
import {useParams} from "react-router-dom";
import {loadQueues, Queue} from "../store/queues";
import ScheduleQueueModal from "../components/modals/ScheduleQueueModal";

const Scheduler = () => {
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

    const [modalShow, setModalShow] = useState(false);

    return (
        <PageLayout>
            <h1>{name}</h1>
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
            <Button
                className={"mb-2"}
                onClick={() => {setModalShow(true)}}
            >Запланировать</Button>
            {queues.map((queue: any) => (
                <div className="mb-3"><ScheduledQueueCard {...queue} schedulerId={id}/></div>
            ))}
            <ScheduleQueueModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                id={id || ""}
            />
        </PageLayout>
    )
}



export default Scheduler