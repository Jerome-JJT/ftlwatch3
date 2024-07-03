import React, { useMemo } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  Tooltip,
  Typography,
} from '@material-tailwind/react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { SuperCards } from 'Common/SuperCards';
import { AiFillStar, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { longDate } from 'Utils/dateUtils';
import { commonTitle } from 'Utils/commonTitle';
import classNames from 'classnames';
import Separator from 'Common/Separator';
import { comparePoolfilters } from 'Utils/comparePoolfilters';
import { useSearchParams } from 'react-router-dom';
import { objUrlEncode } from 'Utils/objUrlEncode';



export function RushesPage(): JSX.Element {
  const { addNotif } = useNotification();
  const [searchParams] = useSearchParams();
  const defaultPool = searchParams.get('pool');
  const defaultProject = searchParams.get('project');

  const [values, setValues] = React.useState<any[] | undefined>(undefined);
  const [projectFilters, setProjectFilters] = React.useState<any[] | undefined>(undefined);
  const [poolFilters, setPoolFilters] = React.useState<any[] | undefined>(undefined);

  const [currentProjectFilter, setCurrentProjectFilter] = React.useState<string | undefined>(defaultProject !== null ? defaultProject : undefined);
  const [currentPoolFilter, setCurrentPoolFilter] = React.useState<string | undefined>(defaultPool !== null ? defaultPool : undefined);

  React.useEffect(() => {document.title = commonTitle('Rushes');}, []);

  function TeamCard(card: any): JSX.Element {

    const users = Object.values(card.users);
    users.sort((a: any, _b: any) => {
      return a.id === card.leader_id ? 1 : 0;
    });


    return (
      <Card key={card.team_id} className="flex min-w-[500px] w-[500px] max-w-[500px] min-h-52 border-black border-2">

        <CardBody className="flex flex-col grow justify-evenly text-center align-center p-2">

          <p color="blue-gray">
            <a href={`https://projects.intra.42.fr/projects/${card.project_slug}/projects_users/${card.projects_user_id}`}>{card.team_name}</a>
          </p>

          <div className="flex flex-row grow justify-evenly text-center align-center gap-2">
            <div className='flex flex-col justify-start'>
              <p>Id : {card.team_id}</p>

              <p color="blue-gray">
                {card.project_name}
              </p>

              <p>Corrector : {card.scale_corrector && <a href={`https://profile.intra.42.fr/users/${card.scale_corrector}`}>{card.scale_corrector} </a> || '-'}</p>
            </div>

            <div className='flex flex-col justify-start'>
              <div className="flex items-center justify-center">
                <p color="blue-gray">Mark : {card.final_mark}</p>

                <Checkbox icon={card.is_validated ? <AiOutlineCheck size='18' /> : <AiOutlineClose size='18' /> }
                  color={card.is_validated ? 'green' : 'deep-orange'} crossOrigin={undefined} checked={true} readOnly disabled></Checkbox>
              </div>

              <p color="blue-gray">State : {card.status}</p>
            </div>
          </div>

          <div className="flex flex-row grow justify-evenly text-center align-center gap-2">
            <textarea rows={6} defaultValue={card.scale_comment}/>

            <textarea rows={6} defaultValue={card.scale_feedback}/>
          </div>
        </CardBody>

        <CardFooter className="flex items-center bg-black/20 justify-between p-3 pb-1">
          <div className="flex items-center -space-x-3">
            {
              users.map((user: any) =>

                user.id === card.leader_id &&
              <Badge key={user.id}
                content={<AiFillStar color='yellow' size='14' />}
                className="min-h-2 min-w-2 bg-transparent bg-black shadow-none"
              >
                <Tooltip content={user.login}>
                  <a href={`https://profile.intra.42.fr/users/${user.login}`}>
                    <Avatar
                      size="sm"
                      variant="circular"
                      src={user.avatar_url}
                      className="border-2 border-white hover:z-10 bg-[#008080]"
                    />
                  </a>
                </Tooltip>
              </Badge>
              ||

              <Tooltip key={user.id} content={user.login}>
                <a href={`https://profile.intra.42.fr/users/${user.login}`}>
                  <Avatar
                    size="sm"
                    variant="circular"
                    src={user.avatar_url}
                    className="border-2 border-white hover:z-10 bg-[#008080]"
                  />
                </a>
              </Tooltip>
              )
            }
          </div>
          <Typography className="font-normal">{longDate(card.updated_at)}</Typography>
        </CardFooter>
      </Card>
    );
  }

  React.useEffect(() => {
    axios
      .get('/?page=projects&action=get_rushes',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setProjectFilters(res.data.project_filters);
          setPoolFilters(() => {
            const pf = res.data.pool_filters;
            pf.sort((a: any, b: any) => comparePoolfilters(a.name, b.name));
            return pf;
          });

          setPoolFilters(res.data.pool_filters);
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
      "filter": currentPoolFilter,
      "project": currentProjectFilter
    });
    window.history.replaceState(null, '', `?${(args && args !== '') ? `?${args}` : ''}`);

  }, [currentPoolFilter, currentProjectFilter]);

  const subOptions = useMemo(() => (
    <>
      <div className='flex flex-wrap gap-2 justify-evenly'>

        {projectFilters && Object.entries(projectFilters).map((filter) => {
          return (
            <Button
              key={filter[0]}
              className={classNames(filter[0] === currentProjectFilter ? 'selected-option' : 'available-option' )}
              onClick={() => { setCurrentProjectFilter((prev) => prev !== filter[0] ? filter[0] : undefined); } }
            >
              {filter[1]}
            </Button>
          );
        })}
      </div>
      <Separator></Separator>

      <div className='flex flex-wrap gap-2 justify-evenly'>

        {poolFilters && poolFilters.map((filter) => {
          return (
            <Button
              key={filter}
              className={classNames(filter === currentPoolFilter ? 'selected-option' : 'available-option' )}
              onClick={() => { setCurrentPoolFilter((prev) => prev !== filter ? filter : undefined); } }
            >
              {filter}
            </Button>
          );
        })}
      </div>
      <Separator></Separator>
    </>

  ), [currentPoolFilter, currentProjectFilter, poolFilters, projectFilters]);

  const displayValues = useMemo(() => {

    if (values === undefined) {
      return undefined;
    }

    return values.filter((team) => {

      if ((currentProjectFilter === undefined || team.project_slug === currentProjectFilter) &&
      (currentPoolFilter === undefined || team.team_pool === currentPoolFilter)) {
        return true;
      }
      return false;
    });
  }, [currentPoolFilter, currentProjectFilter, values]);

  //
  return (
    <div className='my-content'>
      <SuperCards
        values={displayValues}
        customCard={TeamCard}

        subOptions={subOptions}

        tableTitle='Rushes'
        tableDesc={'Rushes projects'}
        options={[25, 50, 100]}
        // reloadFunction={() => { setValues([]); }}
      />
    </div>
  );
}
