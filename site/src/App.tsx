import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import HomePage from './components/GeneralPages/HomePage';

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
import { TeamsPage } from 'Projects/TeamsPage';
import { RulesPage } from 'BasicPages/RulesPage';
import { ProjectsPage } from 'BasicPages/ProjectsPage';
import { ProjectsVisibilityPage } from 'AdminPages/ProjectsVisibility';
import { SettingsPage } from 'Log/Settings';
import NotFoundPage from 'GeneralPages/NotFoundPage';
import { UsersProfilesPage } from 'AdminPages/UsersProfiles';
import { TinderPage } from 'Projects/TinderPage';
import { UsersComputersPage } from 'LocationsPages/UsersComputersPage';
import { UsersTotalPage } from 'LocationsPages/UsersTotalPage';
import { ComputersTotalPage } from 'LocationsPages/ComputersTotalPage';
import { PeaksDaysPage } from 'LocationsPages/PeaksDaysPage';
import { UpdaterPage } from 'AdminPages/Updater';
import { EventPage } from 'Events/EventsPage';
import { LoveGraphPage } from 'LocationsPages/LoveGraphPage';
import AboutPage from 'GeneralPages/AboutPage';
import { PointsPage } from 'BasicPages/PointsPage';
import { SingleProjectPage } from 'BasicPages/SingleProjectsPage';
import { PersonalComputerView } from 'LocationsPages/PersonalComputerView';
import { SubjectsPage } from 'Projects/SubjectsPage';
import { UnmatchedSubjectsPage } from 'Projects/UnmatchedSubjectsPage';
import TigPage from 'Test/Tig';
import { PoolTableauPage } from 'Tableau/PoolTableau';
import { FallGraphPage } from 'FallPages/FallGraphPage';
import { SalesWatchPage } from 'FallPages/SalesWatchPage';
import { OffersPage } from 'BasicPages/OffersPage';
import { RushesPage } from 'Projects/RushesPage';
import { InternshipsPage } from 'Projects/InternshipsPage';
import CalculatorPage from './components/Test/Calculator';
// import Place from './components/Place/Place';




export default function App(): JSX.Element {
  const { isLogged, userInfos, getUserData, logout } = useLogin();
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
      <div className="flex flex-col grow bg-[#008080] bg-center bg-cover" style={{
        backgroundImage: (userInfos?.theme_image && userInfos?.theme_image !== '') ? `url('${userInfos?.theme_image}')` : undefined,
        backgroundColor: (userInfos?.theme_id === 1 || userInfos?.theme_image !== '') ? undefined : userInfos?.theme_color,
      }}>
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
          <Route path="/about" element={<AboutPage />} />

          <Route path="/login" element={<LogPage />} />
          <Route path="/loginapi" element={<LoginApi />} />

          {isLogged && <>
            <Route path="/logout" element={<Logout />} />
            <Route path="/settings" element={<SettingsPage />} />

            <Route path="/basics/achievements" element={<AchievementsPage />} />
            <Route path="/basics/campus" element={<CampusPage />} />
            <Route path="/basics/coalitions" element={<CoalitionsPage />} />
            <Route path="/basics/cursus" element={<CursusPage />} />
            <Route path="/basics/groups" element={<GroupsPage />} />
            <Route path="/basics/products" element={<ProductsPage />} />
            <Route path="/basics/titles" element={<TitlesPage />} />
            <Route path="/basics/points" element={<PointsPage />} />
            <Route path="/basics/projects" element={<ProjectsPage />} />
            <Route path="/basics/projects/:id" element={<SingleProjectPage />} />
            <Route path="/basics/rules" element={<RulesPage />} />
            <Route path="/basics/offers" element={<OffersPage />} />


            <Route path="/tableau" element={<TableauPage />} />
            <Route path="/tableau/pools" element={<PoolTableauPage />} />
            <Route path="/image" element={<ImagePage />} />
            <Route path="/events" element={<EventPage />} />

            <Route path="/projects/teams" element={<TeamsPage />} />
            <Route path="/projects/rushes" element={<RushesPage />} />
            <Route path="/projects/tinder" element={<TinderPage />} />
            <Route path="/projects/subjects" element={<SubjectsPage />} />
            <Route path="/projects/unmatchedsubjects" element={<UnmatchedSubjectsPage />} />
            <Route path="/projects/internships" element={<InternshipsPage />} />

            <Route path="/locations/userscomputers" element={<UsersComputersPage />} />
            <Route path="/locations/userstotal" element={<UsersTotalPage />} />
            <Route path="/locations/computerstotal" element={<ComputersTotalPage />} />
            <Route path="/locations/peaks" element={<PeaksDaysPage />} />
            <Route path="/locations/love" element={<LoveGraphPage />} />

            <Route path="/watch/fall" element={<FallGraphPage />} />
            <Route path="/watch/sales" element={<SalesWatchPage />} />

            <Route path="/locations/personalcomputers" element={<PersonalComputerView />} />

            {/* <Route path="/createaccount" element={<CreateAccountPage />} /> */}
            <Route path="/admin/groups" element={<UserGroupsPage />} />
            <Route path="/admin/permissions" element={<GroupPermissionsPage />} />
            <Route path="/admin/pages" element={<GroupPermissionsPage />} />
            <Route path="/admin/poolfilters" element={<PoolfilterVisibilityPage />} />
            <Route path="/admin/profiles" element={<UsersProfilesPage />} />

            <Route path="/admin/users" element={<UsersVisibilityPage />} />
            <Route path="/admin/projects" element={<ProjectsVisibilityPage />} />

            <Route path="/admin/updater" element={<UpdaterPage />} />


            {/* <Route path="/test" element={<Place loginer={loginer} />} /> */}


            <Route path="/test" element={<TestPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/tig" element={<TigPage />} />
          </>}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <NotifDisplay />
    </Router>
  );
}
