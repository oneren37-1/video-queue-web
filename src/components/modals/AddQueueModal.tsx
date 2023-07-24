import React, {useState} from 'react';
import {Button, Card, Col, Form, InputGroup, Modal, Row} from "react-bootstrap";
import MediaList from "../MediaList";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useNavigate} from "react-router-dom";
import {RootState} from "../../app/store";
import {SubmitHandler, useForm} from "react-hook-form";
import {addQueue, IAddQueueProps} from "../../store/queues";

type Inputs = {
    name: string
}

const AddQueueModal = (props: any) => {
    const dispatch = useAppDispatch();
    const authStatus = useAppSelector((state: RootState) => state.auth.status);

    const [mediaIds, setMediaIds] = useState<string[]>([])

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        dispatch(addQueue({
            name: data.name,
            mediaIds: mediaIds
        }))
        props.onHide();
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Создание очереди
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-default">
                            Имя
                        </InputGroup.Text>
                        <Form.Control {...register("name", { required: true })}/>
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
                        <MediaList ToggleMediaPick={(id: string) => {
                            if (mediaIds.includes(id)) {
                                setMediaIds(mediaIds.filter((mediaId) => mediaId !== id))
                            } else {
                                setMediaIds([...mediaIds, id])
                            }
                        }}/>
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