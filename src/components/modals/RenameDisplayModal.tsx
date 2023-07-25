import React, {useState} from 'react';
import {Button, Col, Form, Modal, Row} from 'react-bootstrap';
import {SubmitHandler, useForm} from "react-hook-form";
import { Cron } from 'react-js-cron'
import CronControl from "../cron/CronControl";
import {renameQueue} from "../../store/queue";
import {useAppDispatch} from "../../app/hooks";
import { renameDisplay } from '../../store/displays';


type Inputs = {
    name: string,
}

const RenameDisplayModal = (props: any) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            name: props.name
        }
    })

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<Inputs> = (data: any) => {
        dispatch(renameDisplay({
            name: data.name,
            id: props.id
        }))
        props.onHide()
    }

    return (
        <Modal
            {...props}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Введите новое имя дисплея
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Название дисплея"
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

export default RenameDisplayModal