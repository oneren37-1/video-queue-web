import React from 'react';
import PageLayout from "./PageLayout";
import QueuesList from "../components/QueuesList";
import {Button} from "react-bootstrap";

const Queues = () => {
    return (
        <PageLayout>
            <Button className={"mb-3"}>Добавить очередь</Button>
            <QueuesList />
        </PageLayout>
    )
}

export default Queues