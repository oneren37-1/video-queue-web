import React from 'react';
import {useAppDispatch, useAppSelector, useWebsocket} from "../app/hooks";
import {RootState} from "../app/store";
import {useNavigate} from "react-router-dom";
import Header from "../components/Header";
import {Container} from "react-bootstrap";
import DisconnectModal from "../components/modals/DisconnectModal";
import {login} from "../store/auth";

const PageLayout = (props: any) => {
    const authStatus = useAppSelector((state: RootState) => state.auth.status);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        if (authStatus === 'idle') {
            const authData = localStorage.getItem('auth')
            if (!authData) navigate('/auth')
            else dispatch(login(JSON.parse(authData)));
        }
        else if (authStatus === 'failed') navigate("/auth");
    }, [authStatus])

    const ws = useWebsocket();
    const [disconnect , setDisconnect] = React.useState(false);

    React.useEffect(() => {
        ws.onclose = () => {
            setDisconnect(true)
        }

        ws.addEventListener('close', () => {
            setDisconnect(true)
        });

        ws.addEventListener('message', (event) => {
            const data = JSON.parse(event.data)
            if (data.type === 'expired') { setDisconnect(true) }
        })

    }, [])


    return (
        <>
            <Header />
            {authStatus === 'ok' && (
                <Container>
                    { props.children }
                </Container>
            )}
            <DisconnectModal
                show={disconnect}
                onHide={() => setDisconnect(false)}
            />
        </>
    )
}

export default PageLayout