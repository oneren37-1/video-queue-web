import React from 'react';
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {Card, Col, Container, ListGroup, Row, Spinner} from "react-bootstrap";
import {loadMedia, Media} from "../store/media";


const MediaList = () => {
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
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={m.img ? " data:image/jpeg;charset=utf-8;base64," + m.img  : "https://www.ballipolimer.com/wp-content/uploads/2020/08/img-placeholder.png"} />
                            <Card.Body>
                                {m.name.length <= 20 && <Card.Title>{m.name}</Card.Title>}
                                {m.name.length > 20 && <Card.Text>{m.name}</Card.Text>}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}

            </Row>
        </div>
    )
}

export default MediaList