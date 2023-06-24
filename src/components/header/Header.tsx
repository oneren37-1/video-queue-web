import React from 'react';
import {Button, Container, Form, Nav, Navbar, NavDropdown, Offcanvas, Stack} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import { useMediaQuery } from 'react-responsive'
import DisplaysList from "../displaysList/DisplaysList";
import {logout} from "../../store/auth";
import {NavLink} from "react-router-dom";

const Header = () => {
    const hostId = useAppSelector((state) => state.auth.hostId);
    const isDesktop = useMediaQuery({ query: '(min-width: 700px)' })
    const dispatch = useAppDispatch();

    return (
        <Navbar bg="light" expand={false} className="mb-3">
            <Container fluid>
                <Stack direction="horizontal" gap={2}>
                    <Navbar.Brand href="/">{hostId}</Navbar.Brand>
                    <NavLink to={"/media"}>Медиа</NavLink>
                    <NavLink to={"/queues"}>Очереди</NavLink>
                    <NavLink to={"/schedulers"}>Планировщики</NavLink>
                </Stack>


                <Button
                    variant="outline-secondary"
                    className="ms-auto"
                    onClick={() => {dispatch(logout())}}
                >Отключиться</Button>
                { !isDesktop && (
                    <>
                        <Navbar.Toggle aria-controls={"offcanvasNavbar-expand-false"} />
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-${false}`}
                            aria-labelledby={"offcanvasNavbarLabel-expand-false"}
                            placement="end"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${false}`}>
                                    Дисплеи
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <DisplaysList />
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </>
                )}
            </Container>
        </Navbar>
    )
}

export default Header