import React from 'react';
import PageLayout from "./PageLayout";
import {Button} from "react-bootstrap";
import SchedulersList from "../components/SchedulersList";
import AddSchedulerModal from "../components/modals/AddSchedulerModal";

const Schedulers = () => {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <PageLayout>
            <Button
                className={"mb-3"}
                onClick={() => setModalShow(true)}
            >Добавить планировщик</Button>
            <SchedulersList />
            <AddSchedulerModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </PageLayout>
    )
}

export default Schedulers