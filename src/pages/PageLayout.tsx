import React from 'react';
import {useAppSelector, useWebsocket} from "../app/hooks";
import {RootState} from "../app/store";
import {useNavigate} from "react-router-dom";
import Header from "../components/Header";
import {Container} from "react-bootstrap";
import DisconnectModal from "../components/modals/DisconnectModal";

const PageLayout = (props: any) => {
    const authStatus = useAppSelector((state: RootState) => state.auth.status);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (authStatus !== 'ok') navigate('/auth')
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
            <Container>
                { props.children }
            </Container>
            <DisconnectModal
                show={disconnect}
            />
        </>
    )
}

export default PageLayout