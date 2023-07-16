import React, {useEffect} from 'react';
import {Button, Container, Form, ListGroup, Nav, Navbar, NavDropdown, Offcanvas, Stack} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import { useMediaQuery } from 'react-responsive'
import DisplaysList from "./DisplaysList";
import {logout} from "../store/auth";
import {NavLink, useLocation} from "react-router-dom";

const Header = () => {
    const hostId = useAppSelector((state) => state.auth.hostId);
    const isDesktop = useMediaQuery({ query: '(min-width: 700px)' })
    const dispatch = useAppDispatch();
    const [show, setShow] = React.useState(false);
    const location = useLocation();

    useEffect(() => {
        setShow(false);
    }, [location]);

    return (
        <Navbar bg="light" expand={false} className="mb-3" style={{position: 'sticky'}}>
            <Container>
                <Stack direction="horizontal" gap={2}>
                    <Navbar.Brand><NavLink to={"/"}>{hostId}</NavLink></Navbar.Brand>
                    { isDesktop && (
                        <>
                            <NavLink to={"/media"}>Медиа</NavLink>
                            <NavLink to={"/queues"}>Очереди</NavLink>
                            <NavLink to={"/schedulers"}>Планировщики</NavLink>
                            <NavLink to={"/logs"}>Логи</NavLink>
                        </>
                    )}

                </Stack>

                { isDesktop && (
                    <Button
                        variant="outline-secondary"
                        className="ms-auto"
                        onClick={() => {dispatch(logout())}}
                    >Отключиться</Button>
                )}

                { !isDesktop && (
                    <>
                        <Navbar.Toggle
                            onClick={() => setShow(true)}
                            aria-controls={"offcanvasNavbar-expand-false"} />
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-${false}`}
                            aria-labelledby={"offcanvasNavbarLabel-expand-false"}
                            placement="end"
                            show={show}
                            onHide={() => setShow(false)}
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${false}`}>
                                    Дисплеи
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <DisplaysList />

                                <ListGroup className={"mt-3"}>
                                    <ListGroup.Item>
                                        <NavLink to={"/media"}>Медиа</NavLink>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <NavLink to={"/queues"}>Очереди</NavLink>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <NavLink to={"/schedulers"}>Планировщики</NavLink>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <NavLink to={"/logs"}>Логи</NavLink>
                                    </ListGroup.Item>
                                </ListGroup>

                                <Button
                                    variant="outline-secondary"
                                    className="ms-auto mt-3"
                                    onClick={() => {dispatch(logout())}}
                                >Отключиться</Button>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </>
                )}
            </Container>
        </Navbar>
    )
}

export default Header