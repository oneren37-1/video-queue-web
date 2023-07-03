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

export interface ICronControlProps {
    value: string,
    onChange: (value: string) => void
}

const CronControl = (props: ICronControlProps) => {
    const {value, onChange} = props;

    const parts = value.split(" ");

    const [activeTab, setActiveTab] = useState<string>("hour")
    const [minState, setMinState] = useState<string>(parts[1])
    const [hourState, setHourState] = useState<string>(parts[2])
    const [dayMState, setDayMState] = useState<string>(parts[3])
    const [monthState, setMonthState] = useState<string>(parts[4])
    const [dayWState, setDayWState] = useState<string>(parts[5])

    const getCronString = () => {
        return `0 ${minState} ${hourState} ${dayMState} ${monthState} ${dayWState} *`
    }

    React.useEffect(() => {
        onChange(getCronString())
        console.log(getCronString())
    }, [minState, hourState, dayMState, dayWState, monthState])

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
                {CronHumanize.humanize(getCronString())}
                <div>{getCronString()}</div>
            </Card.Footer>
        </Card>
    )
}

export default CronControl