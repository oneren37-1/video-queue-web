import React from 'react';
import {useParams} from "react-router-dom";
import PageLayout from "./PageLayout";
import {Button, Card, Container, Stack, Image, Col, Row, ListGroup} from "react-bootstrap";
import AddMediaModal from "../components/AddMediaModal";

const QueuePage = () => {
    const { id } = useParams();
    const [modalShow, setModalShow] = React.useState(false);

    const mediaList = [
        {
            id: "1",
            name: "Media 1",
            img: "https://w.forfun.com/fetch/d6/d620a394f14eddac2b92d7d9b9da72d2.jpeg",
            priority: 1
        },
        {
            id: "2",
            name: "Media 2",
            img: "https://w.forfun.com/fetch/52/5209a3872dced549c0e9a6f8360c5471.jpeg",
            priority: 2
        },
        {
            id: "2",
            name: "Media 3",
            img: "https://w.forfun.com/fetch/56/5656d35727009cabea6ce79973a9702c.jpeg",
            priority: 3
        }
    ]

    return (
        <PageLayout>
            <h1>Queue</h1>
            <Button
                variant={"primary"}
                onClick={() => setModalShow(true)}
            >Добавить медиа в очередь</Button>
            <Card className={"mt-3 p-3"}>
                <ListGroup variant="flush">
                {mediaList && mediaList.map((m, i) => (
                    <ListGroup.Item>
                        <Row className={"mb-1"} key={i}>
                            <Col xs={1} style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column"
                            }}>
                                <Button size={"sm"} variant={"light"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         className="bi bi-chevron-up" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd"
                                              d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                                    </svg>
                                </Button>
                                <Button size={"sm"} variant={"light"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                             className="bi bi-chevron-down" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd"
                                                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                        </svg>
                                    </Button>
                            </Col>

                            <Col className={"d-flex"}>
                                <Image src={m.img} rounded style={{width: "150px", marginRight: "15px"}}/>
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
