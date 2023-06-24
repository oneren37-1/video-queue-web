import React from 'react'
import {Button, Card, Form, Container, Alert} from 'react-bootstrap'
import {SubmitHandler, useForm} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import { RootState } from '../app/store';
import {login, logout} from "../store/auth";
import {useNavigate} from "react-router-dom";

type Inputs = {
    hostId: string
    hostPassword: string
}

const Auth = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const authStatus = useAppSelector((state: RootState) => state.auth.status);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        dispatch(login(data))
    }

    React.useEffect(() => {
        if (authStatus === 'ok') navigate('/')
    }, [authStatus])

    return (
        <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
            <Card body className="border-0 shadow">
                <h3>Подключитесь к хосту</h3>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>ID устройства</Form.Label>
                        <Form.Control type="text" placeholder="Enter ID" {...register("hostId")}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" {...register("hostPassword")}/>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Подключиться
                    </Button>

                    { authStatus === 'failed' && (
                        <div>Ошибка подключения</div>
                    )}
                </Form>
            </Card>
        </Container>
    )
}

export default Auth