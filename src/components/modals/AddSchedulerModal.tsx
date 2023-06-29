import React, {useState} from 'react';
import {Button, Col, Form, Modal, Row} from 'react-bootstrap';
import {SubmitHandler, useForm} from "react-hook-form";
import {useAppDispatch} from "../../app/hooks";
import {addScheduler} from "../../store/schedulers";


type Inputs = {
    name: string,
}

const AddSchedulerModal = (props: any) => {
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
        dispatch(addScheduler({
            name: data.name
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
                    Создание планировщика
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Имя планировщика"
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

export default AddSchedulerModal