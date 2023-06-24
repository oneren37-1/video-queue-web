import React, {useState} from 'react';
import {Button, Col, Form, Modal, Row} from 'react-bootstrap';
import {SubmitHandler, useForm} from "react-hook-form";
import { Cron } from 'react-js-cron'
import CronControl from "./CronControl";
// import 'react-cron-generator/dist/cron-builder.css'


type Inputs = {
    isCron: boolean
    cron: string | null,
    date: string | null,
    time: string | null,
}

const EditScheduledQueueModal = (props: any) => {
    const {id, name, date, time, cron, duration} = props;
    const [value, setValue] = useState('30 5 * * 1,6')

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            isCron: !!cron,
            date: date,
            cron: cron,
        }
    })

    const isCron = watch("isCron");
    const d = watch("date");

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        // dispatch(login(data))
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
                     Редактирование расписания очереди "{name}"
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Check
                            type={"checkbox"}
                            label={"Повторять"}
                            {...register("isCron")}
                        />
                    </Form.Group>

                    {isCron && (<CronControl />)}

                    {!isCron && (
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Дата</Form.Label>
                                    <Form.Control
                                        type={"date"}
                                        {...register("date")}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Время</Form.Label>
                                    <Form.Control
                                        type={"time"}
                                        {...register("time")}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                    )}

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

export default EditScheduledQueueModal