import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import HomePage from "./components/Home/HomePage";
import LogPage from "./components/Log/LogPage";

import NavBar from "./components/NavBar/NavBar";

import LoginApi from "./components/Log/LoginApi";
import Logout from "./components/Log/Logout";

import { UseLoginDto } from "./components/Log/dto/useLogin.dto";
import useLogin from "./components/Log/useLogin";
import CreateAccountPage from "./components/Log/CreateAccountPage";


export default function App() {
  const loginer: UseLoginDto = useLogin();
  const [openedMenu, setOpenedMenu] = React.useState("");

  return (  
    <Router>
      <NavBar
        // loginer={loginer}
        openedMenu={openedMenu}
        setOpenedMenu={setOpenedMenu}
      />

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
