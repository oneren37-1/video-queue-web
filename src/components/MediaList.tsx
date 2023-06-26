import React from 'react';
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {Card, Col, Container, ListGroup, Row, Spinner} from "react-bootstrap";
import {loadMedia, Media} from "../store/media";


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

const MediaCard = (props: any) => {
    const [isSelected, setIsSelected] = React.useState(false);
    const { id, name, img } = props.m

    const handleClick = (id: string) => {
        if (props.ToggleMediaPick) {
            props.ToggleMediaPick(id);
            setIsSelected(prev => !prev);
        }
    }

    return (
        <Card
            border={isSelected ? "primary" : "secondary"}
            style={{ transform: isSelected ? "scale(0.9)" : "scale(1)", transition: "all 0.2s ease-in-out"}}
            onClick={() => handleClick(id)}
        >
            <Card.Img variant="top" src={img ? " data:image/jpeg;charset=utf-8;base64," + img  : "https://www.ballipolimer.com/wp-content/uploads/2020/08/img-placeholder.png"} />
            <Card.Body>
                {name.length <= 20 && <Card.Title>{name}</Card.Title>}
                {name.length > 20 && <Card.Text>{name}</Card.Text>}
            </Card.Body>
        </Card>
    )
}

export default MediaList