import React from 'react';
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {Card, Col, Container, ListGroup, Row, Spinner} from "react-bootstrap";
import {loadMedia, Media} from "../store/media";
import MediaCard from "./MediaCard";


const MediaList = (props: any) => {
    const media: Media[] = useAppSelector((state) => state.media.media);
    const loadingStatus = useAppSelector((state) => state.media.status);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(loadMedia())
    }, [])

    return (
        <div>
            {/*{loadingStatus === "loading" && (*/}
            {/*    <Spinner animation="border" role="status">*/}
            {/*        <span className="visually-hidden">Loading...</span>*/}
            {/*    </Spinner>*/}
            {/*)}*/}
            <Row xs={1} sm={1} md={2} lg={3} xl={3} className="g-3">
                {media.map((m, i) => (
                    <Col key={i} className="d-flex justify-content-center">
                        <MediaCard m={m} ToggleMediaPick={props.ToggleMediaPick}/>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default MediaList