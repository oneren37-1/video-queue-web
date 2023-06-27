import React, {useState} from "react";
import {Form} from "react-bootstrap";
import PickGrid from "./PickGrid";
import {ICronProps} from "./CronControl";

const CronMinutes = (props: ICronProps) => {
    const { state, setState } = props;

    const initialTab = state === "*" ? "every" : "specific";

    const [
        specificValues,
        setSpecificValues
    ] = useState<string[]>(initialTab === "specific" ? state.split(",") : ["0"]);

    const [activeTab, setActiveTab] = useState<string>(initialTab);

    return (
        <div>
            <Form.Group>
                <Form.Check
                    type="radio"
                    label="Каждую минуту"
                    name="cron-minutes"
                    onClick={() => {
                        setActiveTab("every")
                        setState("*")
                    }}
                    checked={activeTab === "every"}
                    onChange={() => {}} // to avoid warning
                />
            </Form.Group>

            <Form.Group>
                <Form.Check
                    type="radio"
                    label="Определенные минуты"
                    name="cron-minutes"
                    onClick={() => setActiveTab("specific")}
                    checked={activeTab === "specific"}
                    onChange={() => {}} // to avoid warning
                />
                {activeTab == "specific" && <PickGrid
                    onChange={(values: string[]) => {
                        setState(values.join(","))
                    }}
                    values={new Array(60).fill(0).map((_, i) => `${i}`)}
                    selectedValues={specificValues}
                />}
            </Form.Group>
        </div>
    )
}

export default CronMinutes