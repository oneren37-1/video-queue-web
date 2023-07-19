import React, {useState} from 'react';
import {Alert, Button, Col, Form, Modal, Row, Stack} from 'react-bootstrap';
import {SubmitHandler, useForm} from "react-hook-form";
import {useAppDispatch} from "../../app/hooks";
import {addScheduler} from "../../store/schedulers";
import {editMedia} from "../../store/media";


type Inputs = {
    name: string,
    durationMin: number,
    durationSec: number,
}

const AddSchedulerModal = (props: any) => {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            name: props.name,
            durationMin: Math.floor(props.duration/60),
            durationSec: props.duration % 60
        }
    })

    const dispatch = useAppDispatch();

    const [formErrors, setFromErrors] = React.useState('');

    const onSubmit: SubmitHandler<Inputs> = (data: any) => {
        if (+data.durationMin === 0 && +data.durationSec === 0) {
            setFromErrors("Время воспроизведения не может быть 0")
            return;
        }

        dispatch(editMedia({
            id: props.id,
            name: data.name,
            duration: data.durationMin*60 + data.durationSec
        }))
        props.onHide()
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Редактирование
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Имя"
                            {...register("name", { required: true })}
                        />
                    </Form.Group>

                    { props.isSlide && (
                        <Form.Group className="mb-3">
                            <Form.Label>Продолжительность</Form.Label>
                            <Form.Control
                                type={"number"}
                                style={{display: "inline", width: "60px"}}
                                className={"m-2"} size={"sm"} min={0}
                                {...register("durationMin")}
                            ></Form.Control> мин
                            <Form.Control
                                type={"number"}
                                style={{display: "inline", width: "60px"}}
                                className={"m-2"} size={"sm"} min={0} max={59}
                                {...register("durationSec")}
                            ></Form.Control> сек
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Stack direction="horizontal" gap={2}>
                            <Button variant="secondary" onClick={() => props.onHide()}>Отменить</Button>
                            <Button variant="primary" type="submit">Сохранить</Button>
                        </Stack>
                    </Form.Group>

                    {formErrors && (
                        <Alert variant={"danger"} className={"mt-2"}> {formErrors} </Alert>
                    )}
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default AddSchedulerModal