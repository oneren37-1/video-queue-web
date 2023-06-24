import React from 'react';
import {Display, loadDisplays} from "../../store/displays";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {Card, ListGroup} from "react-bootstrap";

const DisplaysList = () => {
    const displays: Display[] = useAppSelector((state) => state.displays.displays);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(loadDisplays())
    }, [])

    return (
        <ListGroup>
            {displays.map && displays.map((display, i) => (
                <DisplaysListItem key={i} {...display} />
            ))}
        </ListGroup>
    )
}

export default DisplaysList

const DisplaysListItem = (props: Display) => {
    const {id, name} = props;

    return (
        <ListGroup.Item action href="#link2">
            { name }
        </ListGroup.Item>
    )
}