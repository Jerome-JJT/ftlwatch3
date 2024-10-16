import React, { useMemo } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Button,
  Card,
  CardBody,
} from '@material-tailwind/react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { SuperCards } from 'Common/SuperCards';
import { commonTitle } from 'Utils/commonTitle';
import Separator from 'Common/Separator';
import classNames from 'classnames';
import GaugeChart from 'react-gauge-chart';
import { useSearchParams } from 'react-router-dom';
import { objUrlEncode } from 'Utils/objUrlEncode';




export function TinderPage(): JSX.Element {
  const { addNotif } = useNotification();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultProject = searchParams.get('project');

  const [values, setValues] = React.useState<any[] | undefined>(undefined);
  const [filters, setFilters] = React.useState<any[] | undefined>(undefined);

  const [currentFilter, setCurrentFilter] = React.useState<string | undefined>(defaultProject !== null ? defaultProject : undefined);

  React.useEffect(() => { document.title = commonTitle('Tinder'); }, []);

  function TinderCard(card: any): JSX.Element {

    return (
      <Card id={`${card.circle}-${card.user_id}`} className="flex w-60 border-black border-2">

        <CardBody className="flex flex-col grow text-center align-center p-2">

          <p color="blue-gray">
            {card.projects}
          </p>

          <div className='grow'></div>
          <div className='flex flex-row justify-between items-center'>
            <div>
              <p color="blue-gray">
                <a href={`https://profile.intra.42.fr/users/${card.login}`}>{card.login}</a>
              </p>
              <img className='max-h-20 rounded-lg object-contain' src={card.avatar_url} alt="profile-picture" />
            </div>

            <div className='text-xs md:text-sm text-black dark:text-white'>
              <GaugeChart id={`gauge-chart-${card.circle}-${card.user_id}`}
                hideText={true}
                style={{ width: '140px', marginBottom: '4px' }}
                marginInPercent={0.01}
                nrOfLevels={10}
                colors={['#FF6000', '#00B0B0']}
                animate={false}
                percent={card.score / 200}
                formatTextValue={(value: string) => `${parseInt(value) * 2}%`}
              />
              {card.score}%
            </div>
            <div className='grow'></div>

          </div>
          <div className='text-black dark:text-white'>
            Last projects updated<br/>
            {card.last_projects.map((p: string) => {
              return <React.Fragment key={p}>{p}<br/></React.Fragment>;
            })}
          </div>
        </CardBody>
      </Card>
    );
  }

  const subOptions = useMemo(() => (
    <>
      <div className='flex flex-wrap gap-2 justify-evenly'>

        {filters && Object.entries(filters).map((filtertab) => {
          return (
            <Button
              key={filtertab[0]}
              className={classNames(filtertab[0] === currentFilter ? 'selected-option' : 'available-option')}
              onClick={() => { setCurrentFilter((prev) => prev !== filtertab[0] ? filtertab[0] : undefined); }}
            >
              {filtertab[1].projects.join('/')}
            </Button>
          );
        })}
      </div>
      <Separator></Separator>
    </>

  ), [currentFilter, filters]);

  React.useEffect(() => {
    axios
      .get('/?page=projects&action=get_tinder',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setFilters(res.data.filters);
          setValues(res.data.values);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif]);

  React.useEffect(() => {
    const args = objUrlEncode({
      ...Object.fromEntries(searchParams.entries()),
      'project': currentFilter,
    });
    window.history.replaceState(null, '', `${(args && args !== '') ? `?${args}` : ''}`);
    setSearchParams(args);

  }, [currentFilter, searchParams, setSearchParams]);


  const displayValues = useMemo(() => {

    if (values === undefined) {
      return undefined;
    }

    return Object.entries(values).flatMap((filtertab) => {

      if (currentFilter !== undefined && filtertab[0] !== currentFilter) {
        return [];
      }

      return filtertab[1]
        .sort((a: any, b: any) => a.score < b.score)
        .map((arg: any) => { return { ...arg, circle: filtertab[0], projects: (filters && filters[filtertab[0] as any].projects.join('/') || 'none') }; });
    });

  }, [currentFilter, filters, values]);


  //
  return (
    <div className='my-content'>
      <SuperCards
        values={displayValues}
        customCard={TinderCard}

        subOptions={subOptions}

        tableTitle='Teammate finder'
        tableDesc={`To find peers to do group projects\n
        200% means it's their last project to do\n
        100% means they have access to the project (but not done anything on the circle)\n
        Less than 100% means they can have up to one project and/or exam to do to unlock the circle.\n
        Keep in mind that they can already have a group not registered on the intranet.`}
        options={[10, 25, 50, 100]}
      // reloadFunction={() => { setValues([]); }}
      />
    </div>
  );
}
