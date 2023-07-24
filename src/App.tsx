import React from 'react';
import Auth from "./pages/Auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useAppDispatch, useWebsocket} from "./app/hooks";
import {RootState} from "./app/store";
import {useSelector} from "react-redux";
import Home from "./pages/Home";
import {Route, Router, Routes, useNavigate} from "react-router-dom";
import Media from "./pages/Media";
import Queues from "./pages/Queues";
import Schedulers from "./pages/Schedulers";
import QueuePage from "./pages/Queue";
import Scheduler from "./pages/Scheduler";
import Display from "./components/Display";
import LogsPage from "./pages/Logs";

function App() {
  const authStatus = useSelector((state: RootState) => state.auth.status);
  useWebsocket();

  if (process.env.REACT_APP_FRONTEND_TYPE == "local") {
      window.localStorage.setItem('auth', '{"hostId":"local","hostPassword":"local"}');
  }

  return (
      <Routes>
          <Route path="/" element={<Home />} >
              <Route path=":id" element={<Display />} />
          </Route>
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/media" element={<Media />} />
          <Route path="/queues" element={<Queues />} />
          <Route path="/queue/:id" element={<QueuePage />} />
          <Route path="/schedulers" element={<Schedulers />} />
          <Route path="/scheduler/:id" element={<Scheduler />} />
      </Routes>
  );
}

export default App;
