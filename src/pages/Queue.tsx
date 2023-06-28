import React from 'react';
import {useParams} from "react-router-dom";
import PageLayout from "./PageLayout";
import {Button, Card, Container, Stack, Image, Col, Row, ListGroup} from "react-bootstrap";
import AddMediaModal from "../components/modals/AddMediaModal";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {loadQueue} from "../store/queue";
import {moveMediaDown, moveMediaUp} from '../store/queue';

const QueuePage = () => {
    const { id } = useParams();
    const [modalShow, setModalShow] = React.useState(false);

    const dispatch = useAppDispatch();
    React.useEffect(() => {
        dispatch(loadQueue(`${id}`))
    }, [])

    const updateStatus = useAppSelector((state) => state.queue.updateStatus);

    const name = useAppSelector((state) => state.queue.name)
    const mediaList = useAppSelector((state) => state.queue.items);

    return (
        <PageLayout>
            <h1>{name}</h1>
            <Button
                variant={"primary"}
                onClick={() => setModalShow(true)}
            >Добавить медиа в очередь</Button>
            <Card className={"mt-3 p-3"}>
                <ListGroup variant="flush">
                {(!mediaList || mediaList.length === 0) && <ListGroup.Item>Очередь пуста</ListGroup.Item>}
                {mediaList && mediaList
                    .map(m => m.media)
                    .map((m, i) => (
                    <ListGroup.Item>
                        <Row className={"mb-1"} key={i}>
                            <Col xs={1} style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column"
                            }}>
                                {i !== 0 && (
                                    <Button
                                        disabled={updateStatus === "loading"}
                                        onClick={() => dispatch(moveMediaUp({queueId: id||"", mediaId: m.id}))}
                                        size={"sm"}
                                        variant={"light"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                             className="bi bi-chevron-up" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd"
                                                  d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                                        </svg>
                                    </Button>
                                )}
                                {i !== mediaList.length-1 && (
                                    <Button
                                        disabled={updateStatus === "loading"}
                                        onClick={() => dispatch(moveMediaDown({queueId: id||"", mediaId: m.id}))}
                                        size={"sm"}
                                        variant={"light"}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                 className="bi bi-chevron-down" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd"
                                                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                            </svg>
                                        </Button>
                                )}
                            </Col>

                            <Col className={"d-flex"}>
                                <Image src={m.img ? " data:image/jpeg;charset=utf-8;base64," + m.img  : "https://www.ballipolimer.com/wp-content/uploads/2020/08/img-placeholder.png"} rounded style={{width: "150px", marginRight: "15px"}}/>
                                {m.name.length <= 20 && <Card.Title>{m.name}</Card.Title>}
                                {m.name.length > 20 && <Card.Text>{m.name}</Card.Text>}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
                </ListGroup>
            </Card>
            <AddMediaModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                handleClose={() => setModalShow(false)}/>
        </PageLayout>
    )
}

export default QueuePage
