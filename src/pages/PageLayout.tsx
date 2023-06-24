import React from 'react';
import {useAppSelector} from "../app/hooks";
import {RootState} from "../app/store";
import {useNavigate} from "react-router-dom";
import Header from "../components/header/Header";
import {Container} from "react-bootstrap";

const PageLayout = (props: any) => {
    const authStatus = useAppSelector((state: RootState) => state.auth.status);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (authStatus !== 'ok') navigate('/auth')
    }, [authStatus])

    return (
        <>
            <Header />
            <Container fluid>
                { props.children }
            </Container>
        </>
    )
}

export default PageLayout