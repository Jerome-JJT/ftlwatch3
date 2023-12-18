import React from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import { useNotification } from 'Notifications/NotificationsProvider';
import { commonTitle } from 'Utils/commonTitle';
import { MapPlace } from 'Maps/MapPlace';
import GothamMap from 'Maps/GothamMap';
import {
  Card,
  Tabs,
  TabsHeader,
  TabsBody,
  TabPanel,
  Tab,
} from '@material-tailwind/react';
import SsdMap from 'Maps/SsdMap';
import AsgardMap from 'Maps/AsgardMap';
import { useSearchParams } from 'react-router-dom';


export function PersonalComputerView(): JSX.Element {
  const { addNotif } = useNotification();
  const [searchParams] = useSearchParams();
  const searchLogin = searchParams.get('login');

  const [cursusValues, setCursusValues] = React.useState<MapPlace[] | undefined>(undefined);
  const [piscineValues, setPiscineValues] = React.useState<MapPlace[] | undefined>(undefined);

  function perc2color(perc: number) {
    // eslint-disable-next-line prefer-const
    let r, g, b = 0;
    if(perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
    }
    else {
      g = 255;
      r = Math.round(510 - 5.10 * perc);
    }
    return `rgba(${r}, ${g}, ${b}, ${Math.max(perc / 50, 0.2)})`;
  }


  React.useEffect(() => {document.title = commonTitle('Personal computer view');}, []);

  React.useEffect(() => {
    axios
      .get(`/?page=locations&action=get_personal_computers${searchLogin ? `&login=${searchLogin}` : ''}`,
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {

          let max_all = 0;
          let max_piscine = 0;

          res.data.values.forEach((val: any) => {
            if (val.total > max_all) {
              max_all = val.total;
            }
            if (val.total_piscine > max_piscine) {
              max_piscine = val.total_piscine;
            }
          });

          max_all = Math.log(max_all);
          max_piscine = Math.log(max_piscine);

          const values1 = res.data.values.map((place: any) => {
            return {
              id:    place['host'],
              color: perc2color(place['total'] ? (Math.log(place['total']) / max_all) * 100 : 0),
            };
          });
          setCursusValues(values1);

          const values2 = res.data.values.map((place: any) => {
            return {
              id:    place['host'],
              color: perc2color(place['total_piscine'] ? (Math.log(place['total_piscine']) / max_piscine) * 100 : 0),
            };
          });
          setPiscineValues(values2);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif, searchLogin]);


  return (
    <div className="my-content">
      <Card className="big-card !text-xs md:!text-base">

        <Tabs value="gotham_all">
          <TabsHeader>
            <Tab value='gotham_all'>Gotham all</Tab>
            <Tab value='asgard_all'>Asgard all</Tab>
            <Tab value='ssd_all'>SSD all</Tab>

            <Tab value='gotham_piscine'>Gotham piscine</Tab>
            <Tab value='asgard_piscine'>Asgard piscine</Tab>
            <Tab value='ssd_piscine'>SSD piscine</Tab>
          </TabsHeader>

          <p className="super-description">
            Show where you have been logged the most, green for most, red for least and transparent for not.
            Filterable by pool or all time.
          </p>

          <TabsBody>
            <TabPanel value='gotham_all'><GothamMap id='all' deco={cursusValues} defaultColor='rgba(0,0,0,0)' /></TabPanel>
            <TabPanel value='asgard_all'><AsgardMap id='all' deco={cursusValues} defaultColor='rgba(0,0,0,0)' /></TabPanel>
            <TabPanel value='ssd_all'><SsdMap id='all' deco={cursusValues} defaultColor='rgba(0,0,0,0)' /></TabPanel>

            <TabPanel value='gotham_piscine'><GothamMap id='piscine' deco={piscineValues} defaultColor='rgba(0,0,0,0)' /></TabPanel>
            <TabPanel value='asgard_piscine'><AsgardMap id='piscine' deco={piscineValues} defaultColor='rgba(0,0,0,0)' /></TabPanel>
            <TabPanel value='ssd_piscine'><SsdMap id='piscine' deco={piscineValues} defaultColor='rgba(0,0,0,0)' /></TabPanel>
          </TabsBody>
        </Tabs>

      </Card>
    </div>
  );
}
