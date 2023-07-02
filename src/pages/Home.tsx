import React, {useState} from "react";
import {Col, Container, Nav, Navbar, Row} from "react-bootstrap";
import Header from "../components/Header";
import {useMediaQuery} from "react-responsive";
import DisplaysList from "../components/DisplaysList";
import Scheduler from "./Scheduler";
import {useAppSelector} from "../app/hooks";
import {RootState} from "../app/store";
import {Outlet, Route, Routes, useNavigate} from "react-router-dom";
import Display from "../components/Display";
import PageLayout from "./PageLayout";
import Auth from "./Auth";
import Media from "./Media";
import Queues from "./Queues";
import QueuePage from "./Queue";
import Schedulers from "./Schedulers";

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
                    <Outlet />
                </Col>
            </Row>
        </PageLayout>
    )
}

export default Home