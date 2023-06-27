import React, {useState} from 'react';
import {Card, Col, Container, Form, Nav, Row} from "react-bootstrap";
import CronHumanize from "../../utils/cronHumanize";
import CronMinutes from "./CronMinutes";
import CronHours from "./CronHours";
import CronDays from "./CronDays";
import CronMonth from "./CronMonth";

export interface ICronProps {
    state: string
    setState: (value: string) => void
}
const CronControl = () => {
    const [activeTab, setActiveTab] = useState<string>("hour")
    const [minState, setMinState] = useState<string>("0")
    const [hourState, setHourState] = useState<string>("*")
    const [dayMState, setDayMState] = useState<string>("?")
    const [dayWState, setDayWState] = useState<string>("*")
    const [monthState, setMonthState] = useState<string>("*")

    return (
        <Card className={"mb-3"}>
            <Card.Header>
                <Nav
                    variant="tabs"
                    defaultActiveKey={activeTab}
                    onSelect={(selectedKey: any) => setActiveTab(selectedKey)}
                >
                    <Nav.Item><Nav.Link as={"button"} eventKey="min">Минуты</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link as={"button"} eventKey="hour">Часы</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link as={"button"} eventKey="day">Дни</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link as={"button"} eventKey="month">Месяцы</Nav.Link></Nav.Item>
                </Nav>
            </Card.Header>

            <Card.Body>
                { activeTab === "min" && <CronMinutes state={minState} setState={setMinState}/> }
                { activeTab === "hour" && <CronHours state={hourState} setState={setHourState}/> }
                { activeTab === "day" && <CronDays
                    stateM={dayMState} setStateM={setDayMState}
                    stateW={dayWState} setStateW={setDayWState}
                /> }
                { activeTab === "month" && <CronMonth state={monthState} setState={setMonthState} /> }
            </Card.Body>
            <Card.Footer className="text-muted">
                {CronHumanize.humanize(`0 ${minState || 0} ${hourState} ${dayMState} ${monthState} ${dayWState} *`)}
                {/*<div>{`0 ${minState || 0} ${hourState} ${dayMState} ${monthState} ${dayWState} *`}</div>*/}
            </Card.Footer>
        </Card>
    )
}

export default CronControl