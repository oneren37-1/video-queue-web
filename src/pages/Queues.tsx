import React from 'react';
import PageLayout from "./PageLayout";
import QueuesList from "../components/QueuesList";
import {Button} from "react-bootstrap";
import AddQueueModal from "../components/AddQueueModal";

const Queues = () => {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <PageLayout>
            <Button
                className={"mb-3"}
                onClick={() => setModalShow(true)}
            >Добавить очередь</Button>
            <QueuesList />
            <AddQueueModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </PageLayout>
    )
}

export default Queues