import React, {useState} from 'react';
import {Alert, Button, Col, Form, Modal, Row} from 'react-bootstrap';
import {SubmitHandler, useForm} from "react-hook-form";
import { Cron } from 'react-js-cron'
import CronControl from "../cron/CronControl";
import {changeDefaultQueue, schedule} from "../../store/scheduler";
import {Queue} from "../../store/queues";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {login} from "../../store/auth";


type Inputs = {
    queueId: string,
    durationMin: number,
    durationHours: number,
    isCron: boolean
    date: string | null,
    time: string | null,
}

const ScheduleQueueModal = (props: any) => {
    const { id } = props;
    const [ cronInput, setCronInput] = useState('0 0 * * * ? *')

    const [formErrors, setFormErrors] = useState<string>("")

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            isCron: true,
            durationMin: 0,
            durationHours: 0
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

        if (!(data.durationHours + data.durationMin * 60)) {
            setFormErrors("Необходимо указать длительность очереди");
            return;
        }

        dispatch(schedule({
            id: id,
            queueId: data.queueId,
            queueName: queuesNames.find((q) => q.id === data.queueId)?.name,
            duration: +data.durationHours + (data.durationMin * 60),
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
                    Запланировать очередь
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/*<Form onSubmit={(e) => {*/}
                {/*    e.preventDefault();*/}
                {/*    console.log("onSubmit")*/}
                {/*}}>*/}
                    <Form.Group className="mb-3">
                        <Form.Label>Выберите очередь</Form.Label>
                        <Form.Select
                            className={"col-sm mb-3"}
                            {...register("queueId")}
                        >
                            {queuesNames && queuesNames.map(q => (
                                <option value={q.id || "null"}>{q.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

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

export default ScheduleQueueModal