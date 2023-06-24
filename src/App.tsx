import React from 'react';
import Auth from "./pages/Auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useWebsocket} from "./app/hooks";
import {RootState} from "./app/store";
import {useSelector} from "react-redux";
import Home from "./pages/Home";
import {Route, Router, Routes} from "react-router-dom";
import Media from "./pages/Media";
import Queues from "./pages/Queues";
import Schedulers from "./pages/Schedulers";

function App() {
  const authStatus = useSelector((state: RootState) => state.auth.status);
  useWebsocket();

  return (
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/media" element={<Media />} />
          <Route path="/queues" element={<Queues />} />
          <Route path="/schedulers" element={<Schedulers />} />
      </Routes>
  );
}

export default App;
