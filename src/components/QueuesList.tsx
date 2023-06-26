import React from 'react';
import {loadMedia, Media} from "../store/media";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {Card, Col, Row} from "react-bootstrap";
import {loadQueues, Queue} from "../store/queues";
import {NavLink} from "react-router-dom";

const QueuesList = () => {
    // const queues: Queue[] = useAppSelector((state) => state.queues.queues);
    const queues: Queue[] = [
        {
            id: "1",
            name: "Queue 1"
        },
        {
            id: "2",
            name: "Queue 2"
        },
        {
            id: "3",
            name: "Queue 3"
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
            {queues.map((q, i) => (
                <NavLink to={`/queue/${q.id}`}>
                    <Card className={"mb-2"}>
                        <Card.Body>
                            {q.name.length <= 20 && <Card.Title>{q.name}</Card.Title>}
                            {q.name.length > 20 && <Card.Text>{q.name}</Card.Text>}
                        </Card.Body>
                    </Card>
                </NavLink>
            ))}
        </div>
    )
}

export default QueuesList