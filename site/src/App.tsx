import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import HomePage from './components/Home/HomePage';

import NavBar from './components/NavBar/NavBar';

import LoginApi from './components/Log/LoginApi';
import Logout from './components/Log/Logout';

import CreateAccountPage from './components/Log/CreateAccountPage';
import LeftDrawer from './components/NavBar/LeftDrawer';
import axios from 'axios';
import { AxiosErrorText } from './components/Hooks/AxiosErrorText';

import { LogPage } from './components/Log/LogPage';
import { TableauPage } from './components/Tableau/Tableau';

import { NotifDisplay } from './components/Notifications/NotifDisplay';
import { UserGroupsPage } from './components/Permissions/UserGroups';
import { GroupPermissionsPage } from './components/Permissions/GroupPermissions';
import { PagePermissionsPage } from './components/Permissions/PagePermissions';
import { useLogin } from './components/Hooks/LoginProvider';
// import Place from './components/Place/Place';

export default function App (): JSX.Element {
  const { isLogged, logout } = useLogin();
  const [openedMenu, setOpenedMenu] = React.useState('');

  const logging = import.meta.env.DEV;

  axios.interceptors.request.use(
    function (req) {
      req.baseURL = `${import.meta.env.VITE_API_PREFIX}`
      // req.meta.requestStartedAt = new Date().getTime();
      return req;
    });

  axios.interceptors.response.use(
    function (response) {
      if (logging && response.config.method !== 'OPTIONS') { console.log('inter res', response) }

      return response;
    },
    async function (error) {
      if (logging && error.response.config.method !== 'OPTIONS') { console.log('myaxiosintercept', AxiosErrorText(error), error) }

      if (error.response && error.response.status === 401) {
        logout();
      }
      // if ((error.response && error.response.data && error.response.data.detail) === 'Invalid token.' && error.request.responseURL.indexOf("logout") === -1) {
      // }

      return await Promise.reject(error);
    }
  );

  return (
    <Router>
      <NavBar
        openedMenu={openedMenu}
        setOpenedMenu={setOpenedMenu}
      />

      <LeftDrawer
        openedMenu={openedMenu}
        setOpenedMenu={setOpenedMenu} />

      <div className="grow bg-gray-100 dark:bg-gray-400">
        <Routes>
          <Route path="/" element={<HomePage />} />

          {!isLogged && (
            <>
              <Route path="/start" element={<p></p>} />
            </>
          )}
          {isLogged && (
            <>
            </>
          )}
          <Route path="/tableau" element={<TableauPage />} />

          <Route path="/groups" element={<UserGroupsPage />} />
          <Route path="/permissions" element={<GroupPermissionsPage />} />
          <Route path="/pages" element={<PagePermissionsPage />} />

          {/* <Route path="/test" element={<Place loginer={loginer} />} /> */}
          <Route path="/login" element={<LogPage />} />
          <Route path="/loginapi" element={<LoginApi />} />
          <Route
            path="/logout"
            element={<Logout />}
          />

            <>
              <Route path="/createaccount" element={<CreateAccountPage />} />
            </>
        </Routes>
      </div>
      <NotifDisplay/>
    </Router>
  );
}
