import React from 'react';
import {useParams} from "react-router-dom";
import PageLayout from "./PageLayout";
import {Button, Card, Container, Stack, Image, Col, Row, ListGroup, Alert, Spinner} from "react-bootstrap";
import AddMediaModal from "../components/modals/AddMediaModal";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {loadQueue, removeMedia} from "../store/queue";
import {moveMediaDown, moveMediaUp} from '../store/queue';
import RenameQueueModal from "../components/modals/RenameQueueModal";

const QueuePage = () => {
    const { id } = useParams();
    const [modalShow, setModalShow] = React.useState(false);
    const [renameModalShow, setRenameModalShow] = React.useState(false);

    const dispatch = useAppDispatch();
    React.useEffect(() => {
        dispatch(loadQueue(`${id}`))
    }, [])

    const updateStatus = useAppSelector((state) => state.queue.updateStatus);
    const loadStatus = useAppSelector((state) => state.queue.status);

    const name = useAppSelector((state) => state.queue.name)
    const mediaList = useAppSelector((state) => state.queue.items);

    return (
        <PageLayout>
            {loadStatus === "loading" && (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            )}
            {loadStatus === "failed" && (
                <Alert variant={"danger"}>
                    Ошибка загрузки
                </Alert>
            )}
            {loadStatus === "ok" && (
                <>
                    <Stack direction="horizontal" gap={2}>
                        <h1>{name}</h1>
                        <Button
                            variant={"outline-secondary"}
                            onClick={() => setRenameModalShow(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                <path
                                    d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                            </svg>
                        </Button>
                        <Button
                            variant={"primary"}
                            onClick={() => setModalShow(true)}
                        >Добавить медиа в очередь</Button>
                    </Stack>

                    <RenameQueueModal
                        show={renameModalShow}
                        onHide={() => setRenameModalShow(false)}
                        name={name}
                        id={id}
                    />

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
                                                            <path fillRule="evenodd"
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
                                                            <path fillRule="evenodd"
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
                                            <Col xs={1}>
                                                <Button
                                                    disabled={updateStatus === "loading"}
                                                    onClick={() => dispatch(removeMedia({queueId: id||"", mediaId: m.id}))}
                                                    size={"sm"}
                                                    variant={"outline-danger"}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                         fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                                        <path
                                                            d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                                    </svg>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                        </ListGroup>
                    </Card>
                    <AddMediaModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        handleClose={() => setModalShow(false)}
                        queueId={id}
                    />
                </>
            )}
        </PageLayout>
    )
}

export default QueuePage
