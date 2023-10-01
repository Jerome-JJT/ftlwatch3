import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import HomePage from './components/Home/HomePage';

import NavBar from './components/NavBar/NavBar';

import LoginApi from './components/Log/LoginApi';
import Logout from './components/Log/Logout';

import useLogin, { type UseLoginDto } from './components/Hooks/useLogin';
import CreateAccountPage from './components/Log/CreateAccountPage';
import LeftDrawer from './components/NavBar/LeftDrawer';
import axios from 'axios';
import { AxiosErrorText } from './components/Hooks/AxiosErrorText';

import { LogPage } from './components/Log/LogPage';
import { TableauPage } from './components/Tableau/Tableau';

import { NotificationProvider } from './components/Notifications/NotificationsProvider';
import { NotifDisplay } from './components/Notifications/NotifDisplay';
import { UserGroupsPage } from './components/Permissions/UserGroups';
import { GroupPermissionsPage } from './components/Permissions/GroupPermissions';
import { PagePermissionsPage } from './components/Permissions/PagePermissions';
// import Place from './components/Place/Place';

export default function App (): JSX.Element {
  const loginer: UseLoginDto = useLogin();
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
        loginer.logout();
      }
      // if ((error.response && error.response.data && error.response.data.detail) === 'Invalid token.' && error.request.responseURL.indexOf("logout") === -1) {
      // }

      return await Promise.reject(error);
    }
  );

  return (
    <NotificationProvider>

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
            <Route path="/tableau" element={<TableauPage loginer={loginer} />} />

            <Route path="/groups" element={<UserGroupsPage loginer={loginer} />} />
            <Route path="/permissions" element={<GroupPermissionsPage loginer={loginer} />} />
            <Route path="/pages" element={<PagePermissionsPage loginer={loginer} />} />

            {/* <Route path="/test" element={<Place loginer={loginer} />} /> */}
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
        <NotifDisplay/>
      </Router>
    </NotificationProvider>
  );
}
