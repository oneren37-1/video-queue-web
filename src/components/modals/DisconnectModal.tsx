import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import {useAppDispatch} from "../../app/hooks";
import {useNavigate} from "react-router-dom";
import {deleteQueue} from "../../store/queue";
import {deleteScheduler} from "../../store/scheduler";
import {logout} from "../../store/auth";

const DisconnectModal = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleAuth = () => {
        if (process.env.REACT_APP_FRONTEND_TYPE === "local") {
            navigate("/");
            props.onHide();
            return;
        }
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

export default DisconnectModal