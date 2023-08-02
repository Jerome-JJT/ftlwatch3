import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import HomePage from "./components/Home/HomePage";
import LogPage from "./components/Log/LogPage";

import NavBar from "./components/NavBar/NavBar";

import LoginApi from "./components/Log/LoginApi";
import Logout from "./components/Log/Logout";

import useLogin, { UseLoginDto } from "./components/Hooks/useLogin";
import CreateAccountPage from "./components/Log/CreateAccountPage";
import LeftDrawer from "./components/NavBar/LeftDrawer";
import axios from "axios";
import { AxiosErrorText } from "./components/Hooks/AxiosErrorText";
import Tableau from "./components/Tableau/Tableau";


export default function App() {
  const loginer: UseLoginDto = useLogin();
  const [openedMenu, setOpenedMenu] = React.useState("");

  const logging = import.meta.env.DEV;
  
  axios.interceptors.request.use(
    function (req) {
      req.baseURL = `${import.meta.env.VITE_API_PREFIX}`
      // req.meta.requestStartedAt = new Date().getTime();
      return req;
  });

  axios.interceptors.response.use(
    function (response) {
      if (logging) { console.log('inter res', response) }

      return response;
    },
    function (error) {
      if (logging) { console.log('myaxiosintercept', AxiosErrorText(error), error) }

      // console.log('ttt', error);
      if (error.response && error.response.status === 401) {
        loginer.logout();
        // userStore.logout();
      }
      // if ((error.response && error.response.data && error.response.data.detail) === 'Invalid token.' && error.request.responseURL.indexOf("logout") === -1) {
      // }

      return Promise.reject(error);
    }
  );

  return (  
    <Router>
      <NavBar
        loginer={loginer}
        openedMenu={openedMenu}
        setOpenedMenu={setOpenedMenu}
      />

      <LeftDrawer
        loginer={loginer}
        openedMenu={openedMenu}
        setOpenedMenu={setOpenedMenu} />

      <div className="grow bg-gray-100 dark:bg-gray-400">
        <Routes>
          <Route path="/" element={<HomePage />} />

          {!loginer.logged && (
            <>
              <Route path="/start" element={<p></p>} />
            </>
          )}
          {loginer.logged && (
            <>
            </>
          )}
          <Route path="/tableau" element={<Tableau loginer={loginer} />} />
          <Route path="/login" element={<LogPage loginer={loginer} />} />
          <Route path="/loginapi" element={<LoginApi loginer={loginer} />} />
          <Route
            path="/logout"
            element={<Logout loginer={loginer} />}
          />

            <>
              <Route path="/createaccount" element={<CreateAccountPage />} />
            </>
        </Routes>
      </div>
    </Router>
  );
}
