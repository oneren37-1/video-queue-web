import React, {useState} from 'react';
import {Button, Col, Form, Modal, Row} from 'react-bootstrap';
import {SubmitHandler, useForm} from "react-hook-form";
import { Cron } from 'react-js-cron'
import CronControl from "../cron/CronControl";
import {renameQueue} from "../../store/queue";
import {useAppDispatch} from "../../app/hooks";


type Inputs = {
    name: string,
}

const EditScheduledQueueModal = (props: any) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            name: props.name
        }
    })

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<Inputs> = (data: any) => {
        dispatch(renameQueue({
            name: data.name,
            id: props.id
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
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Введите новое имя очереди
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Название очереди"
                            {...register("name")}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail" >
                        <Button variant="primary" type="submit">Сохранить</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default EditScheduledQueueModal