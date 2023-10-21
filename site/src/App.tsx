import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import HomePage from './components/Home/HomePage';

import NavBar from './components/NavBar/NavBar';

import LoginApi from './components/Log/LoginApi';
import Logout from './components/Log/Logout';

import LeftDrawer from './components/NavBar/LeftDrawer';
import axios from 'axios';
import { AxiosErrorText } from './components/Hooks/AxiosErrorText';

import { LogPage } from './components/Log/LogPage';

import { NotifDisplay } from './components/Notifications/NotifDisplay';
import { UserGroupsPage } from './components/AdminPages/UserGroups';
import { GroupPermissionsPage } from './components/AdminPages/GroupPermissions';
import { useLogin } from './components/Hooks/LoginProvider';
import TestPage from './components/Test/Test';
import { TableauPage } from 'Tableau/Tableau';
import { ImagePage } from 'Image/Image';
import { PoolfilterVisibilityPage } from 'AdminPages/PoolfilterVisibility';
import { UsersVisibilityPage } from 'AdminPages/UsersVisibility';
import { CoalitionsPage } from 'BasicPages/CoalitionsPage';
import { CampusPage } from 'BasicPages/CampusPage';
import { TitlesPage } from 'BasicPages/TitlesPage';
import { ProductsPage } from 'BasicPages/ProductPage';
import { CursusPage } from 'BasicPages/CursusPage';
import { GroupsPage } from 'BasicPages/GroupsPage';
import { AchievementsPage } from 'BasicPages/AchievementsPage';
import { TeamsPage } from 'Teams/TeamsPage';
import { RulesPage } from 'BasicPages/RulesPage';
import { ProjectsPage } from 'BasicPages/ProjectsPage';
import { ProjectsVisibilityPage } from 'AdminPages/ProjectsVisibility';
import { SettingsPage } from 'Log/Settings';
// import Place from './components/Place/Place';




export default function App(): JSX.Element {
  const { isLogged, getUserData, logout } = useLogin();
  const [openedMenu, setOpenedMenu] = React.useState('');

  const logging = import.meta.env.DEV;

  React.useEffect(() => {
    if (!location.pathname.includes('loginapi')) {
      getUserData();
    }
  }, [getUserData]);

  axios.interceptors.request.use(
    (req) => {
      req.baseURL = '/api';
      // req.meta.requestStartedAt = new Date().getTime();
      return req;
    });

  axios.interceptors.response.use(
    (response) => {
      // eslint-disable-next-line no-console
      if (logging && response.config.method !== 'OPTIONS') { console.log('inter res', response); }

      return response;
    },
    (error) => {
      // eslint-disable-next-line no-console
      if (logging && error.response.config.method !== 'OPTIONS') { console.log('myaxiosintercept', AxiosErrorText(error), error); }

      if (error.response && error.response.status === 401) {
        logout();
      }

      return Promise.reject(error);
    }
  );

  return (
    <Router>
      <div className="grow bg-gray-300 dark:bg-gray-800">
        <NavBar
          openedMenu={openedMenu}
          setOpenedMenu={setOpenedMenu}
        />

        <LeftDrawer
          openedMenu={openedMenu}
          setOpenedMenu={setOpenedMenu}
        />

        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LogPage />} />
          <Route path="/loginapi" element={<LoginApi />} />

          {isLogged && <>
            <Route path="/logout" element={<Logout />} />
            <Route path="/settings" element={<SettingsPage />} />

            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/campus" element={<CampusPage />} />
            <Route path="/coalitions" element={<CoalitionsPage />} />
            <Route path="/cursus" element={<CursusPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/titles" element={<TitlesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/rules" element={<RulesPage />} />


            <Route path="/tableau" element={<TableauPage />} />
            <Route path="/image" element={<ImagePage />} />
            <Route path="/teams" element={<TeamsPage />} />

            {/* <Route path="/createaccount" element={<CreateAccountPage />} /> */}
            <Route path="/admin/groups" element={<UserGroupsPage />} />
            <Route path="/admin/permissions" element={<GroupPermissionsPage />} />
            <Route path="/admin/pages" element={<GroupPermissionsPage />} />
            <Route path="/admin/poolfilters" element={<PoolfilterVisibilityPage />} />

            <Route path="/admin/users" element={<UsersVisibilityPage />} />
            <Route path="/admin/projects" element={<ProjectsVisibilityPage />} />


            {/* <Route path="/test" element={<Place loginer={loginer} />} /> */}


            <Route path="/test" element={<TestPage />} />
          </>}
        </Routes>
      </div>
      <NotifDisplay/>
    </Router>
  );
}
