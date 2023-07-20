import React from 'react';
import {Display, loadDisplays} from "../store/displays";
import {handleSignal, useAppDispatch, useAppSelector} from "../app/hooks";
import {Button, Card, ListGroup} from "react-bootstrap";
import {NavLink} from "react-router-dom";

const DisplaysList = (props: any) => {
    const displays: Display[] = useAppSelector((state) => state.displays.displays);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(loadDisplays())
    }, [])

    return (
        <>
            <ListGroup {...props}>
                {displays.map && displays.map((display, i) => (
                    <DisplaysListItem key={i} {...display} />
                ))}
            </ListGroup>
            <Button
                variant={"outline-secondary"} size={"sm"}
                className={"mt-2"}
                onClick={() => handleSignal("identify")}
            >Определить</Button>
        </>
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