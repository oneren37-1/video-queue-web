import React, {useState} from "react";
import {Form} from "react-bootstrap";
import PickGrid from "./PickGrid";
import {ICronProps} from "./CronControl";

const CronDays = (props: any) => {
    const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    const weekdaysAlias = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const { stateM, setStateM, stateW, setStateW } = props;

    let initialTab = "";

    if (stateM === "?") {
        if (stateW === "*") initialTab = "every";
        else if (stateW.indexOf("#") !== -1) initialTab = "#";
        else initialTab = "specific-weekdays";
    } else {
        if (stateM === "*") initialTab = "every";
        else if (stateM === "L") initialTab = "last";
        else if (stateM === "LW") initialTab = "last-workday";
        else if (stateM.indexOf("/") !== -1) initialTab = "periodically";
        else if (stateM.indexOf("-") !== -1) initialTab = "interval";
        else initialTab =  "specific";
    }

    const [
        specificValues,
        setSpecificValues
    ] = useState<string[]>(initialTab === "specific" ? stateM.split(",") : ["1"]);

    const [
        specificWeekdaysValues,
        setSpecificWeekdaysValues
    ] = useState<string[]>(initialTab === "specific-weekdays" ? stateW.split(",") : [weekdays[0]]);

    const [
        periodicallyValue,
        setPeriodicallyValue
    ] = useState<string[]>(initialTab === "periodically" ? stateM.split("/") : ["1", "1"]);

    const [
        intervalValue,
        setIntervalValue
    ] = useState<string[]>(initialTab === "interval" ? stateM.split("-") : ["0", "0"]);

    const [
        nthWeekdayValue,
        setNthWeekdayValue
    ] = useState<string[]>(initialTab === "#" ? stateW.split("#") : ["1", weekdays[0]]);

    const [activeTab, setActiveTab] = useState<string>(initialTab);


    return (
        <div>
            <Form.Group>
                <Form.Check
                    type="radio"
                    label="Каждый день"
                    name="cron-days"
                    onClick={() => {
                        setActiveTab("every")
                        setStateM("*");
                        setStateW("?");
                    }}
                    checked={activeTab === "every"}
                    onChange={() => {}} // to avoid warning
                />
            </Form.Group>
            <Form.Group>
                <Form.Check
                    type="radio"
                    label="Последний день месяца"
                    name="cron-days"
                    onClick={() => {
                        setActiveTab("last")
                        setStateM("L");
                        setStateW("?");
                    }}
                    checked={activeTab === "last"}
                    onChange={() => {}} // to avoid warning
                />
            </Form.Group>
            <Form.Group>
                <Form.Check
                    type="radio"
                    label="Последний рабочий день месяца"
                    name="cron-days"
                    onClick={() => {
                        setActiveTab("last-workday")
                        setStateM("LW");
                        setStateW("?");
                    }}
                    checked={activeTab === "last-workday"}
                    onChange={() => {}} // to avoid warning
                />
            </Form.Group>
            <Form.Group>
                <Form.Check
                    type="radio"
                    label="Периодично"
                    name={"cron-days"}
                    onClick={() => {
                        setActiveTab("periodically")
                        setStateM(`${periodicallyValue[1]}/${periodicallyValue[0]}`);
                        setStateW("?");
                    }}
                    checked={activeTab === "periodically"}
                    onChange={() => {}} // to avoid warning
                />
                {activeTab == "periodically" && (
                    <>
                        <Form.Label>Каждый <Form.Select
                            size={"sm"}
                            style={{display: "inline-block", width: "80px"}}
                            onChange={(e) => {
                                const value = e.target.value;
                                setPeriodicallyValue([value, periodicallyValue[1]]);
                                setStateM(`${periodicallyValue[1]}/${value}`);
                                setStateW("?");
                            }}
                            value={periodicallyValue[0]}
                        >
                            {new Array(30).fill(0).map((_, i) => <option key={i}>{i+1}</option>)}
                        </Form.Select> день начиная с <Form.Select
                            size={"sm"}
                            style={{display: "inline-block", width: "80px"}}
                            onChange={(e) => {
                                const value = e.target.value;
                                setPeriodicallyValue([periodicallyValue[0], value]);
                                setStateM(`${value}/${periodicallyValue[0]}`);
                                setStateW("?");
                            }}
                            value={periodicallyValue[1]}
                        >
                            {new Array(31).fill(0).map((_, i) => <option key={i}>{i+1}</option>)}
                        </Form.Select></Form.Label>
                    </>
                )}
            </Form.Group>

            <Form.Group>
                <Form.Check
                    type="radio"
                    label="Определенные дни месяца"
                    name="cron-days"
                    onClick={() => {
                        setActiveTab("specific");
                        setStateM(specificValues.join(","));
                        setStateW("?");
                    }}
                    checked={activeTab === "specific"}
                    onChange={() => {}} // to avoid warning
                />
                {activeTab == "specific" && <PickGrid
                    onChange={(values: string[]) => {
                        setSpecificValues(values);
                        setStateM(values.join(","))
                        setStateW("?");
                    }}
                    selectedValues={specificValues}
                    values={new Array(31).fill(0).map((_, i) => `${i+1}`)} />}
            </Form.Group>

            <Form.Group>
                <Form.Check
                    type="radio"
                    label="Определенные дни недели"
                    name="cron-days"
                    onClick={() => {
                        setActiveTab("specific-weekdays");
                        setStateM("?");
                        setStateW(specificWeekdaysValues.map(v => {
                            const index = weekdays.indexOf(v);
                            return weekdaysAlias[index];
                        }).join(","));
                    }}
                    checked={activeTab === "specific-weekdays"}
                    onChange={() => {}} // to avoid warning
                />
                {activeTab == "specific-weekdays" && <PickGrid
                    onChange={(values: string[]) => {
                        setStateM("?");
                        setStateW(values.map(v => {
                            const index = weekdays.indexOf(v);
                            return weekdaysAlias[index];
                        }).join(","));
                    }}
                    selectedValues={specificWeekdaysValues}
                    values={weekdays} />}
            </Form.Group>

            {/*<Form.Group>*/}
            {/*    <Form.Check*/}
            {/*        type="radio"*/}
            {/*        label="N-ное вхождение опреленного дня недели в месяце"*/}
            {/*        name="cron-days"*/}
            {/*        onClick={() => {*/}
            {/*            setActiveTab("#");*/}
            {/*            setStateM("?");*/}
            {/*            setNthWeekdayValue(["1", "1"])*/}
            {/*            setStateW(`${nthWeekdayValue[1]}#${nthWeekdayValue[0]}`);*/}
            {/*        }}*/}
            {/*        checked={activeTab === "#"}*/}
            {/*        onChange={() => {}} // to avoid warning*/}
            {/*    />*/}
            {/*    {activeTab == "#" && (*/}
            {/*        <>*/}
            {/*            <Form.Select*/}
            {/*                size={"sm"}*/}
            {/*                style={{display: "inline-block", width: "80px"}}*/}
            {/*                onChange={(e) => {*/}
            {/*                    const value = e.target.value;*/}
            {/*                    setNthWeekdayValue([value, nthWeekdayValue[1]]);*/}
            {/*                    setStateM("?");*/}
            {/*                    setStateW(`${nthWeekdayValue[1] || 1}#${value}`);*/}
            {/*                }}*/}
            {/*                value={nthWeekdayValue[0]}*/}
            {/*            >*/}
            {/*                {new Array(5).fill(0).map((_, i) => <option key={i}>{i+1}</option>)}*/}
            {/*            </Form.Select>*/}
            {/*            <Form.Select*/}
            {/*                size={"sm"}*/}
            {/*                style={{display: "inline-block", width: "80px"}}*/}
            {/*                onChange={(e) => {*/}
            {/*                    const value = e.target.value;*/}
            {/*                    let index = weekdays.indexOf(value);*/}
            {/*                    if (index === 6) index = -1;*/}
            {/*                    index += 2*/}

            {/*                    setNthWeekdayValue([nthWeekdayValue[0], index.toString()]);*/}
            {/*                    setStateM("?");*/}
            {/*                    setStateW(`${index}#${nthWeekdayValue[0]}`);*/}
            {/*                }}*/}
            {/*                // @ts-ignore*/}
            {/*                value={nthWeekdayValue[1] === "1" ? weekdays[6] : weekdays[parseInt(nthWeekdayValue[1])-2]}*/}
            {/*            >*/}
            {/*                {weekdays.map((v, i) => <option key={i}>{v}</option>)}*/}
            {/*            </Form.Select>*/}
            {/*        </>*/}
            {/*    )}*/}
            {/*</Form.Group>*/}
        </div>
    )
}

export default CronDays