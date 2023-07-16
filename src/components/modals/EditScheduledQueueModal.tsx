import React, {useState} from 'react';
import {Alert, Button, Col, Form, Modal, Row} from 'react-bootstrap';
import {SubmitHandler, useForm} from "react-hook-form";
import { Cron } from 'react-js-cron'
import CronControl from "../cron/CronControl";
import {changeDefaultQueue, editSchedule, schedule} from "../../store/scheduler";
import {Queue} from "../../store/queues";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {login} from "../../store/auth";


type Inputs = {
    durationMin: number,
    durationHours: number,
    isCron: boolean
    date: string | null,
    time: string | null,
}

const EditScheduledQueueModal = (props: any) => {
    const { id, queueName, cron, duration, schedulerId } = props;

    const [ cronInput, setCronInput] = useState(cron || "0 0 * * * ? *")

    const [formErrors, setFormErrors] = useState<string>("")

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            isCron: !!cron,
            durationMin: duration -  Math.round(duration / 60) * 60,
            durationHours: Math.round(duration / 60)
        }
    })

    const dispatch = useAppDispatch();
    const isCron = watch("isCron");

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setFormErrors("")

        if (!isCron && (!data.date || !data.time)) {
            setFormErrors("Необходимо указать дату и время");
            return;
        }

        if (!(+data.durationMin + (data.durationHours * 60))) {
            setFormErrors("Необходимо указать длительность очереди");
            return;
        }

        dispatch(editSchedule({
            id: schedulerId,
            itemId: id,
            duration: +data.durationMin + (data.durationHours * 60),
            cron: data.isCron ? cronInput : null,
            date: data.isCron ? null : data.date + " " + data.time,
        }))

        props.onHide();
    }

    const queuesNames: Queue[] = useAppSelector((state) => state.queues.queues);

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Редактирование расписания очереди {queueName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/*<Form onSubmit={(e) => {*/}
                {/*    e.preventDefault();*/}
                {/*    console.log("onSubmit")*/}
                {/*}}>*/}
                <Form.Group className="mb-3">
                    <Form.Check
                        type={"checkbox"}
                        label={"Повторять"}
                        {...register("isCron")}
                    />
                </Form.Group>

                {isCron && (<CronControl
                    value={cronInput}
                    onChange={(val) => setCronInput(val)}
                />)}

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

                <Form.Group className="mb-3">
                    <Form.Label>Продолжительность</Form.Label>
                    <Form.Control
                        type={"number"}
                        style={{display: "inline", width: "60px"}}
                        className={"m-2"} size={"sm"} min={0} max={23}
                        {...register("durationHours")}
                    ></Form.Control> часов
                    <Form.Control
                        type={"number"}
                        style={{display: "inline", width: "60px"}}
                        className={"m-2"} size={"sm"} min={0} max={59}
                        {...register("durationMin")}
                    ></Form.Control> минут
                </Form.Group>

                {formErrors && (
                    <Alert variant={"danger"}>{formErrors}</Alert>
                )}

                <Form.Group className="mb-3">
                    <Button variant="primary"
                            onClick={handleSubmit(onSubmit)}
                    >
                        Сохранить
                    </Button>
                </Form.Group>
                {/*</Form>*/}
            </Modal.Body>
        </Modal>
    )
}

export default EditScheduledQueueModal