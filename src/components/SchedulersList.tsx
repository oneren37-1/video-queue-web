import React from 'react';
import {loadMedia, Media} from "../store/media";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {Card, Col, Row, Spinner} from "react-bootstrap";
import {loadQueues, Queue} from "../store/queues";
import {NavLink} from "react-router-dom";
import {loadSchedulers} from "../store/schedulers";

const SchedulersList = () => {
    const schedulers = useAppSelector((state) => state.schedulers.schedulers);
    const loadingStatus = useAppSelector((state) => state.schedulers.status);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(loadSchedulers())
    }, [])

    return (
        <div>
            {loadingStatus === "loading" && (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            )}
            {loadingStatus === "ok" && schedulers && schedulers.map((s, i) => (
                <NavLink to={`/scheduler/${s.id}`}>
                    <Card className={"mb-2"}>
                        <Card.Body>
                            {s.name.length <= 20 && <Card.Title>{s.name}</Card.Title>}
                            {s.name.length > 20 && <Card.Text>{s.name}</Card.Text>}
                        </Card.Body>
                    </Card>
                </NavLink>
            ))}
        </div>
    )
}

export default SchedulersList