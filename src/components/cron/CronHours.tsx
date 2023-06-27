import React, {useState} from "react";
import {Form} from "react-bootstrap";
import PickGrid from "./PickGrid";
import {ICronProps} from "./CronControl";

const CronHours = (props: ICronProps) => {
    const { state, setState } = props;

    let initialTab = "";
    if (state === "*") initialTab = "every";
    else if (state.indexOf("/") !== -1) initialTab = "periodically";
    else if (state.indexOf("-") !== -1) initialTab = "interval";
    else initialTab =  "specific";

    const [
        specificValues,
        setSpecificValues
    ] = useState<string[]>(initialTab === "specific" ? state.split(",") : ["0"]);

    const [
        periodicallyValue,
        setPeriodicallyValue
    ] = useState<string[]>(initialTab === "periodically" ? state.split("/") : ["1", "0"]);
    const [
        intervalValue,
        setIntervalValue
    ] = useState<string[]>(initialTab === "interval" ? state.split("-") : ["0", "0"]);

    const [activeTab, setActiveTab] = useState<string>(initialTab);


    return (
        <div>
            <Form.Group>
                <Form.Check
                    type="radio"
                    label="Каждый час"
                    name="cron-hours"
                    onClick={() => {
                        setActiveTab("every");
                        setState("*");
                    }}
                    checked={activeTab === "every"}
                    onChange={() => {}} // to avoid warning
                />
            </Form.Group>
            <Form.Group>
                <Form.Check
                    type="radio"
                    label="Периодично"
                    name={"cron-hours"}
                    onClick={() => {
                        setActiveTab("periodically")
                        setState(`${periodicallyValue[1]}/${periodicallyValue[0]}`);
                    }}
                    checked={activeTab === "periodically"}
                    onChange={() => {}} // to avoid warning
                />
                {activeTab == "periodically" && (
                    <>
                        <Form.Label>Каждые <Form.Select
                            size={"sm"}
                            style={{display: "inline-block", width: "80px"}}
                            onChange={(e) => {
                                const value = e.target.value;
                                setPeriodicallyValue([value, periodicallyValue[1]]);
                                setState(`${periodicallyValue[1]}/${value}`);
                            }}
                            value={periodicallyValue[0]}
                        >
                            {new Array(23).fill(0).map((_, i) => <option key={i}>{i+1}</option>)}
                        </Form.Select> часов начиная с <Form.Select
                            size={"sm"}
                            style={{display: "inline-block", width: "80px"}}
                            onChange={(e) => {
                                const value = e.target.value;
                                setPeriodicallyValue([periodicallyValue[0], value]);
                                setState(`${value}/${periodicallyValue[0]}`);
                            }}
                            value={periodicallyValue[1]}
                        >
                            {new Array(23).fill(0).map((_, i) => <option key={i}>{i}</option>)}
                        </Form.Select></Form.Label>
                    </>
                )}
            </Form.Group>

            <Form.Group>
                <Form.Check
                    type="radio"
                    label="Определенные часы"
                    name="cron-hours"
                    onClick={() => {
                        setActiveTab("specific");
                        setState(specificValues.join(","));
                    }}
                    checked={activeTab === "specific"}
                    onChange={() => {}} // to avoid warning
                />
                {activeTab == "specific" && <PickGrid
                    onChange={(values: string[]) => {
                        setState(values.join(","))
                    }}
                    selectedValues={specificValues}
                    values={new Array(24).fill(0).map((_, i) => `${i}`)} />}
            </Form.Group>

            <Form.Group>
                <Form.Check
                    type="radio"
                    label="Каждый час в промежутке"
                    name="cron-hours"
                    onClick={() => {
                        setActiveTab("interval")
                        setState(intervalValue.join("-"));
                    }}
                    checked={activeTab === "interval"}
                    onChange={() => {}} // to avoid warning
                />
                {activeTab == "interval" && (
                    <Form.Label>C <Form.Select
                        size={"sm"}
                        style={{display: "inline-block", width: "80px"}}
                        onChange={(e) => {
                            const value = e.target.value;
                            setIntervalValue([value, intervalValue[1]]);
                            setState(`${value}-${intervalValue[1]}`);
                        }}
                        value={intervalValue[0]}
                    >
                        {new Array(24).fill(0).map((_, i) => <option key={i}>{i}</option>)}
                    </Form.Select> по <Form.Select
                        size={"sm"}
                        style={{display: "inline-block", width: "80px"}}
                        onChange={(e) => {
                            const value = e.target.value;
                            setIntervalValue([intervalValue[0], value]);
                            setState(`${intervalValue[0]}-${value}`);
                        }}
                        value={intervalValue[1]}
                    >
                        {new Array(24).fill(0).map((_, i) => <option key={i}>{i}</option>)}
                    </Form.Select></Form.Label>
                )}
            </Form.Group>
        </div>
    )
}

export default CronHours