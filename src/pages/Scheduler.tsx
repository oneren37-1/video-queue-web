import React, {useState} from 'react';
import {Button, Card, Col, Form} from 'react-bootstrap';
import ScheduledQueueCard from "../components/ScheduledQueueCard";
import PageLayout from "./PageLayout";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {changeDefaultQueue, loadScheduler} from "../store/scheduler";
import {useParams} from "react-router-dom";
import {loadQueues, Queue} from "../store/queues";
import ScheduleQueueModal from "../components/modals/ScheduleQueueModal";
import RemoveSchedulerModal from "../components/modals/RemoveSchedulerModal";

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
    const [removeModalShow, setRemoveModalShow] = useState(false);

    return (
        <PageLayout>
            <h1>{name}</h1>
            <Button variant={"outline-danger"} onClick={() => {setRemoveModalShow(true)}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     className="bi bi-trash" viewBox="0 0 16 16">
                    <path
                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                    <path
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                </svg>
                {` Удалить планировщик`}
            </Button>
            <RemoveSchedulerModal
                show={removeModalShow}
                onHide={() => {setRemoveModalShow(false)}}
                schedulerId={id}
            />
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
            {queues.map((queue: any, i: number) => (
                <div className="mb-3">
                    <ScheduledQueueCard
                        {...queue}
                        schedulerId={id}
                        isFirst={i === 0}
                        isLast={i === queues.length-1}
                    />
                </div>
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