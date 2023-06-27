import React from 'react';
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import CronControl from "./cron/CronControl";
import MediaList from "./MediaList";

const AddMediaModal = (props: any) => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Что добавить в очередь?
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <MediaList
                    ToggleMediaPick={(mediaId: string) => {
                        console.log(mediaId)
                    }}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button>Добавить</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddMediaModal