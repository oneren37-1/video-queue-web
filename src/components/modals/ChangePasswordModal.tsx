import React, {useState} from 'react';
import {Button, Col, Form, Modal, Row} from 'react-bootstrap';
import {SubmitHandler, useForm} from "react-hook-form";
import {useAppDispatch} from "../../app/hooks";
import {addScheduler} from "../../store/schedulers";
import {changePassword} from "../../store/auth";


type Inputs = {
    pass: string,
}

const ChangePasswordModal = (props: any) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            pass: ""
        }
    })

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<Inputs> = (data: any) => {
        dispatch(changePassword(data.pass));
        props.onHide()
    }

    return (
        <Modal
            {...props}
            size="lg"
            centered
        >
        <Modal.Header>
            <Modal.Title>
                Сменить пароль
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Новый пароль"
                        {...register("pass", { required: true })}
                    />
                </Form.Group>

                <Form.Group className="mb-3" >
                <Button variant="primary" type="submit">Сохранить</Button>
                </Form.Group>
            </Form>
        </Modal.Body>
        </Modal>
    )
}

export default ChangePasswordModal