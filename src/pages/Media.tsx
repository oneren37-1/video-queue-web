import React from 'react';
import PageLayout from "./PageLayout";
import {Card} from "react-bootstrap";
import UploadFile from "../components/UploadFile";
import MediaList from "../components/MediaList";

const Media = () => {
    return (
        <PageLayout>
            <div className={"mb-4"}>
                <UploadFile />
            </div>
            <MediaList />
        </PageLayout>
    )
}

export default Media