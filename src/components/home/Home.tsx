import React, {useState} from "react";
import {Col, Container, Nav, Navbar, Row} from "react-bootstrap";
import Header from "../header/Header";
import {useMediaQuery} from "react-responsive";
import DisplaysList from "../displaysList/DisplaysList";
import Display from "../display/Display";
import Scheduler from "../scheduler/Scheduler";

const Home = () => {

    const isDesktop = useMediaQuery({ query: '(min-width: 700px)' })


    return (
        <div>
            <Header />
            <Container fluid>
                <Row>
                    {isDesktop && (
                        <Col className="sidebar" md={2}>
                            <h3>Дисплеи</h3>
                            <DisplaysList />
                        </Col>

                    )}
                    <Col className="content" md={10}>
                        <Scheduler />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Home