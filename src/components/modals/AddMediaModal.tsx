import React, {useState} from 'react';
import {Button, Card, Col, Form, Modal, Row} from "react-bootstrap";
import CronControl from "../cron/CronControl";
import MediaList from "../MediaList";
import {addQueue} from "../../store/queues";
import {useAppDispatch} from "../../app/hooks";
import {addMediaToQueue} from "../../store/queue";

const AddMediaModal = (props: any) => {
    const [mediaIds, setMediaIds] = useState<string[]>([])

    const dispatch = useAppDispatch();

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
                <Card
                    className={"mb-3"}
                    style={{
                        padding: "20px",
                        height: "300px",
                        overflowY: "scroll",
                        overflowX: "hidden"
                    }}
                >
                    <MediaList ToggleMediaPick={(id: string) => {
                        if (mediaIds.includes(id)) {
                            setMediaIds(mediaIds.filter((mediaId) => mediaId !== id))
                        } else {
                            setMediaIds([...mediaIds, id])
                        }
                    }}/>
                </Card>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={() => {
                        dispatch(addMediaToQueue({
                            queueId: props.queueId,
                            mediaIds: mediaIds
                        }))
                        props.onHide()
                    }}
                >Добавить</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddMediaModal