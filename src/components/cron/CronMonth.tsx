import React, {useState} from "react";
import { Form } from "react-bootstrap";
import PickGrid from "./PickGrid";
import {ICronProps} from "./CronControl";

const CronMonth = (props: ICronProps) => {
    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентярь", "Октябрь", "Ноябрь", "Декабрь"];

    const monthsAlias = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    const { state, setState } = props;

    let initialTab = "";
    if (state === "*") initialTab = "every";
    else if (state.indexOf("/") !== -1) initialTab = "periodically";
    else if (state.indexOf("-") !== -1) initialTab = "interval";
    else initialTab =  "specific";

    const [
        specificValues,
        setSpecificValues
    ] = useState<string[]>(initialTab === "specific" ? state.split(",") : ["Январь"]);

    const [
        intervalValue,
        setIntervalValue
    ] = useState<string[]>(initialTab === "interval" ? state.split("-") : ["1", "1"]);

    const [activeTab, setActiveTab] = useState<string>(initialTab);

    return (
        <div>
            <Form.Group>
                <Form.Check
                    type="radio"
                    label="Каждый месяц"
                    name="cron-month"
                    onClick={() => {
                        setActiveTab("every")
                        setState("*");
                    }}
                    checked={activeTab === "every"}
                    onChange={() => {}} // to avoid warning
                />
            </Form.Group>

            <Form.Group>
                <Form.Check
                    type="radio"
                    label="Определенные месяцы"
                    name="cron-month"
                    onClick={() => {
                        setActiveTab("specific");
                        setState(specificValues.map(v => {
                            const index = months.indexOf(v);
                            return monthsAlias[index];
                        }).join(","));
                    }}
                />
                {activeTab == "specific" && <PickGrid
                    onChange={(values: string[]) => {
                        setSpecificValues(values);
                        console.log(values)
                        setState(values.map(v => {
                            const index = months.indexOf(v);
                            return monthsAlias[index];
                        }).join(","))
                    }}
                    selectedValues={specificValues}
                    values={months} />}
            </Form.Group>

            <Form.Group>
                <Form.Check
                    type="radio"
                    label="Каждый месяц в промежутке"
                    name="cron-month"
                    onClick={() => setActiveTab("interval")}
                />
                {activeTab == "interval" && (
                    <Form.Label>C <Form.Select
                        size={"sm"}
                        style={{display: "inline-block", width: "120px"}}

                        onChange={(e) => {
                            const value = months.indexOf(e.target.value)+1;
                            setIntervalValue([value.toString(), intervalValue[1]]);
                            setState(`${value}-${intervalValue[1]}`);
                        }}
                        // @ts-ignore
                        value={months[intervalValue[0]-1]}
                        >
                        {months.map((v, i) => <option key={i}>{v}</option>)}
                    </Form.Select> по <Form.Select
                        size={"sm"}
                        style={{display: "inline-block", width: "120px"}}
                        onChange={(e) => {
                            const value = months.indexOf(e.target.value) + 1;
                            setIntervalValue([intervalValue[0], value.toString()]);
                            setState(`${intervalValue[0]}-${value}`);
                        }}
                        // @ts-ignore
                        value={months[intervalValue[1]-1]}
                    >
                        {months.map((v, i) => <option key={i}>{v}</option>)}
                    </Form.Select></Form.Label>
                )}
            </Form.Group>
        </div>
    )
}

export default CronMonth;