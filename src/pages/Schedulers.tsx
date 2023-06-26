import React from 'react';
import PageLayout from "./PageLayout";
import {Button} from "react-bootstrap";
import SchedulersList from "../components/SchedulersList";

const Schedulers = () => {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <PageLayout>
            <Button
                className={"mb-3"}
                onClick={() => setModalShow(true)}
            >Добавить планировщик</Button>
            <SchedulersList />
        </PageLayout>
    )
}

export default Schedulers