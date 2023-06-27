import React, {useState} from "react";
import {Col, Container, Nav, Navbar, Row} from "react-bootstrap";
import Header from "../components/Header";
import {useMediaQuery} from "react-responsive";
import DisplaysList from "../components/DisplaysList";
import Scheduler from "./Scheduler";
import {useAppSelector} from "../app/hooks";
import {RootState} from "../app/store";
import {useNavigate} from "react-router-dom";
import Display from "../components/Display";
import PageLayout from "./PageLayout";

const Home = () => {

    const isDesktop = useMediaQuery({ query: '(min-width: 700px)' })

    return (
        <PageLayout>
            <Row>
                {isDesktop && (
                    <Col className="sidebar" md={2}>
                        <h3>Дисплеи</h3>
                        <DisplaysList />
                    </Col>

                )}
                <Col className="content" md={10}>
                    <Display />
                </Col>
            </Row>
        </PageLayout>
    )
}

export default Home