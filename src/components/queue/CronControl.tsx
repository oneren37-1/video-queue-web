import React, {useState} from 'react';
import {Card, Form, Nav} from "react-bootstrap";
import CronHumanize from "../../utils/cronHumanize";

const CronControl = () => {
    const [activeTab, setActiveTab] = useState<string>("hour")

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
                { activeTab === "min" && <CronMinutes /> }
                { activeTab === "hour" && <CronHours /> }
                { activeTab === "day" && <CronDays /> }
                { activeTab === "month" && <Cronmonths /> }
            </Card.Body>
            <Card.Footer className="text-muted">
                {CronHumanize.humanize("10-20 10/1 12/1 ? 5/FEB 2-THU 2020-2022")}
            </Card.Footer>
        </Card>
    )
}

const CronMinutes = () => {
    return (
        <div>
            <Form.Group>
                <Form.Check
                    type="radio"
                    label="Каждую минуту"
                />
            </Form.Group>
            <Form.Group>
                <Form.Check type="radio" />
                <Form.Label>Каждые <Form.Select size={"sm"} style={{display: "inline-block", width: "60px"}}>
                    {new Array(3).fill(0).map((_, i) => <option key={i}>{i*5 + 10}</option>)}
                </Form.Select> минут начиная с <Form.Select size={"sm"} style={{display: "inline-block", width: "60px"}}>
                    {new Array(11).fill(0).map((_, i) => <option key={i}>{i*5}</option>)}
                </Form.Select></Form.Label>
            </Form.Group>

            <Form.Group>
                <Form.Check type="radio" label="Определенные минуты" />
                <Form.Label>Каждые <Form.Select size={"sm"} style={{display: "inline-block", width: "60px"}}>
                    {new Array(3).fill(0).map((_, i) => <option key={i}>{i*5 + 10}</option>)}
                </Form.Select> минут начиная с <Form.Select size={"sm"} style={{display: "inline-block", width: "60px"}}>
                    {new Array(11).fill(0).map((_, i) => <option key={i}>{i*5}</option>)}
                </Form.Select></Form.Label>
            </Form.Group>
        </div>
    )
}

const CronHours = () => {
    return (
        <div>
            <h1>Hours</h1>
        </div>
    )
}

const CronDays = () => {
    return (
        <div>
            <h1>Days</h1>
        </div>
    )
}

const Cronmonths = () => {
    return (
        <div>
            <h1>months</h1>
        </div>
    )
}

export default CronControl