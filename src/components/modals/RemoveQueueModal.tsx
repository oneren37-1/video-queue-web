import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import {useAppDispatch} from "../../app/hooks";
import {useNavigate} from "react-router-dom";
import {deleteQueue} from "../../store/queue";

const RemoveQueueModal = (props: any) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleDelete = () => {
        dispatch(deleteQueue(props.queueId))
        navigate("/queues")
    }

    return (
        <Modal {...props}>
            <Modal.Header closeButton>
                <Modal.Title>Подтверждение</Modal.Title>
            </Modal.Header>
            <Modal.Body>Вы точно хотите удалить очередь?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Отмена
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Удалить
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default RemoveQueueModal