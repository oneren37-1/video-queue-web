import React from 'react';
import {Button, ButtonGroup, Card, Modal, Stack, ToggleButton} from "react-bootstrap";
import CronHumanize from "../utils/cronHumanize";
import EditScheduledQueueModal from "./modals/EditScheduledQueueModal";

const ScheduledQueueCard = (props: any) => {
    const {id, queue, cron, duration, emitTime} = props;
    const [RemoveQueueModalShow, setRemoveQueueModalShow] = React.useState(false);

    const [editModalShow, setEditModalShow] = React.useState(false);
    const [deleteModalShow, setDeleteModalShow] = React.useState(false);
    const handleEdit = () => {
        setEditModalShow(true);
    }

    const getDurationStr = (duration: number) => {
        const hours = Math.floor(duration/60);
        const minutes = Math.floor(duration) - hours*60;

        return `${hours}ч ${minutes} мин`;
    }

    return (
        <Card style={{ width: '40rem' }} >
            <Card.Body>
                <Card.Title>{ queue.name }</Card.Title>
                {emitTime && (
                    <Card.Text>
                        {new Date(emitTime).toLocaleString()}
                    </Card.Text>
                )}
                {cron && (
                    <Card.Text>
                        {CronHumanize.humanize(cron)}
                    </Card.Text>
                )}
                {duration && (
                    <Card.Text>
                        Продолжительность: { getDurationStr(duration) }
                    </Card.Text>
                )}
            </Card.Body>
            <Card.Footer>
                <Stack direction="horizontal" gap={2}>
                    <ButtonGroup>
                        <Button size="sm" variant="outline-secondary" className="pb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-arrow-up" viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                      d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
                            </svg>
                        </Button>
                        <Button size="sm" variant="outline-secondary" className="pb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-arrow-down" viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                      d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
                            </svg>
                        </Button>
                    </ButtonGroup>
                    <Button onClick={() => handleEdit()} size="sm" variant="outline-primary" className="pb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-pencil" viewBox="0 0 16 16">
                                <path
                                    d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                            </svg>
                        </Button>
                    <Button onClick={() => setDeleteModalShow(true)} size="sm" variant="outline-danger" className="pb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-trash" viewBox="0 0 16 16">
                            <path
                                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                            <path
                                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                        </svg>
                    </Button>
                </Stack>
            </Card.Footer>
            <RemoveQueueModal
                show={deleteModalShow}
                onHide={() => setDeleteModalShow(false)}
                handleClose={() => setRemoveQueueModalShow(false)}/>

            <EditScheduledQueueModal
                show={editModalShow}
                onHide={() => setEditModalShow(false)}
                {...props}/>
        </Card>
    )
}

const RemoveQueueModal = (props: any) => {
    return (
        <Modal {...props}>
            <Modal.Header closeButton>
                <Modal.Title>Подтверждение</Modal.Title>
            </Modal.Header>
            <Modal.Body>Вы точно ходите удалить очередь из планирочщика?</Modal.Body>
            <Modal.Footer>
                <Button variant="danger">
                    Удалить
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ScheduledQueueCard;
