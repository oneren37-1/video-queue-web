import React from 'react';
import Auth from "./components/auth/Auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card, Col, Container, Row} from 'react-bootstrap';
import {useWebsocket} from "./app/hooks";
import {RootState} from "./app/store";
import {useSelector} from "react-redux";
import Home from "./components/home/Home";

function App() {
  const authStatus = useSelector((state: RootState) => state.auth.status);
  useWebsocket();

  return (
      <>
        {authStatus !== 'ok' && (
            <Auth />
        )}
        {authStatus === 'ok' && (
            <Home />
        )}
      </>
  );
}

export default App;
