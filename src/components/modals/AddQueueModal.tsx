import React, {useState} from 'react';
import {Button, Card, Col, Form, InputGroup, Modal, Row} from "react-bootstrap";
import MediaList from "../MediaList";

const AddQueueModal = (props: any) => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Создание очедери
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-default">
                            Имя
                        </InputGroup.Text>
                        <Form.Control />
                    </InputGroup>

                    <Card
                        className={"mb-3"}
                        style={{
                            padding: "20px",
                            height: "300px",
                            overflowY: "scroll",
                            overflowX: "hidden"
                        }}
                    >
                        <MediaList ToggleMediaPick={() => {}}/>
                    </Card>

                    <Form.Group className="mb-3" controlId="formBasicEmail" >
                        <Button variant="primary" type="submit">
                            Сохранить
                        </Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default AddQueueModal