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


export function PersonalComputerView(): JSX.Element {
  const { addNotif } = useNotification();

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
    const h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
  }


  React.useEffect(() => {document.title = commonTitle('Personal computer view');}, []);

  React.useEffect(() => {
    axios
      .get('/?page=locations&action=get_personal_computers',
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

          const values1 = res.data.values.map((place: any) => {
            place['id'] = place['host'];
            place['color'] = perc2color(place['total'] ? (place['total'] / max_all) * 100 : 0);
            return place;
          });
          setCursusValues(values1);

          const values2 = res.data.values.map((place: any) => {
            place['id'] = place['host'];
            place['color'] = perc2color(place['total_piscine'] ? (place['total_piscine'] / max_piscine) * 100 : 0);
            return place;
          });
          setPiscineValues(values2);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif]);


  return (
    <Card className="my-content big-card !text-xs md:!text-base">

      <Tabs value="gotham_all">
        <TabsHeader>
          <Tab value='gotham_all'>Gotham all</Tab>
          <Tab value='asgard_all'>Asgard all</Tab>
          <Tab value='ssd_all'>SSD all</Tab>

          <Tab value='gotham_piscine'>Gotham piscine</Tab>
          <Tab value='asgard_piscine'>Asgard piscine</Tab>
          <Tab value='ssd_piscine'>SSD piscine</Tab>
        </TabsHeader>

        <TabsBody>
          <TabPanel value='gotham_all'><GothamMap deco={cursusValues} /></TabPanel>
          <TabPanel value='asgard_all'><AsgardMap deco={cursusValues} /></TabPanel>
          <TabPanel value='ssd_all'><SsdMap deco={cursusValues} /></TabPanel>

          <TabPanel value='gotham_piscine'><GothamMap deco={piscineValues} /></TabPanel>
          <TabPanel value='asgard_piscine'><AsgardMap deco={piscineValues} /></TabPanel>
          <TabPanel value='ssd_piscine'><SsdMap deco={piscineValues} /></TabPanel>
        </TabsBody>
      </Tabs>

    </Card>
  );
}
