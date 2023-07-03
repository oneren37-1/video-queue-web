import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import {useAppDispatch} from "../../app/hooks";
import {useNavigate} from "react-router-dom";
import {deleteQueue} from "../../store/queue";
import {deleteScheduler} from "../../store/scheduler";

const RemoveSchedulerModal = (props: any) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleDelete = () => {
        dispatch(deleteScheduler(props.schedulerId))
        navigate("/schedulers")
    }

    return (
        <Modal {...props}>
            <Modal.Header closeButton>
                <Modal.Title>Подтверждение</Modal.Title>
            </Modal.Header>
            <Modal.Body>Вы точно хотите удалить планировщик?</Modal.Body>
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

export default RemoveSchedulerModal