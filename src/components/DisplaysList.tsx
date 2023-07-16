import React from 'react';
import {Display, loadDisplays} from "../store/displays";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {Card, ListGroup} from "react-bootstrap";
import {NavLink} from "react-router-dom";

const DisplaysList = (props: any) => {
    const displays: Display[] = useAppSelector((state) => state.displays.displays);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(loadDisplays())
    }, [])

    return (
        <ListGroup {...props}>
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
        <ListGroup.Item>
            <NavLink to={id}>{ name }</NavLink>
        </ListGroup.Item>
    )
}