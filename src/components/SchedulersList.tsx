import React from 'react';
import {loadMedia, Media} from "../store/media";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {Card, Col, Row} from "react-bootstrap";
import {loadQueues, Queue} from "../store/queues";
import {NavLink} from "react-router-dom";

const SchedulersList = () => {
    const schedulers: Queue[] = [
        {
            id: "1",
            name: "Scheduler 1"
        },
        {
            id: "2",
            name: "Scheduler 2"
        },
        {
            id: "3",
            name: "Scheduler 3"
        }
    ];
    // const loadingStatus = useAppSelector((state) => state.queues.status);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(loadQueues())
    }, [])

    return (
        <div>
            {/*{loadingStatus === "loading" && (*/}
            {/*    <Spinner animation="border" role="status">*/}
            {/*        <span className="visually-hidden">Loading...</span>*/}
            {/*    </Spinner>*/}
            {/*)}*/}
            {schedulers && schedulers.map((s, i) => (
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