import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import {useAppDispatch} from "../../app/hooks";
import {useNavigate} from "react-router-dom";
import {deleteQueue} from "../../store/queue";
import {deleteScheduler} from "../../store/scheduler";
import {logout} from "../../store/auth";

const RemoveSchedulerModal = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleAuth = () => {
        dispatch(logout())
        navigate("/auth")
    }

    return (
        <Modal {...props}>
            <Modal.Header closeButton>
                <Modal.Title>Упс</Modal.Title>
            </Modal.Header>
            <Modal.Body>Соединение с хостом разорвано</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleAuth}>
                    Переподключиться
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default RemoveSchedulerModal