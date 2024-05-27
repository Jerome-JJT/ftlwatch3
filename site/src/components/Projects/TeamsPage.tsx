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
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
  Typography,
} from '@material-tailwind/react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { SuperCards } from 'Common/SuperCards';
import { AiFillStar, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { longDate, shortDate } from 'Utils/dateUtils';
import { commonTitle } from 'Utils/commonTitle';
import classNames from 'classnames';
import Separator from 'Common/Separator';





export function TeamsPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [values, setValues] = React.useState<any[] | undefined>(undefined);
  const [filters, setFilters] = React.useState<any[] | undefined>(undefined);

  const [currentFilter, setCurrentFilter] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Teams');}, []);

  function TeamCard(card: any): JSX.Element {

    const users = Object.values(card.users);
    users.sort((a: any, _b: any) => {
      return a.id === card.leader_id ? 1 : 0;
    });


    return (
      <Card key={card.retry_common} className="flex min-w-80 w-80 max-w-80 h-52 border-black border-2">

        <CardBody className="flex flex-row grow justify-evenly text-center align-center gap-2 p-2">

          <div className='flex flex-col justify-center gap-4'>
            <p color="blue-gray">
              <a href={`https://projects.intra.42.fr/projects/${card.project_slug}/projects_users/${card.projects_user_id}`}>{card.team_name}</a>
            </p>
            <p color="blue-gray">
              {card.project_name}
            </p>
          </div>

          <div className='flex flex-col justify-evenly'>
            <div className="flex items-center justify-center">
              <p color="blue-gray">Mark : {card.final_mark}</p>

              <Checkbox icon={card.is_validated ? <AiOutlineCheck size='18' /> : <AiOutlineClose size='18' /> }
                color={card.is_validated ? 'green' : 'deep-orange'} crossOrigin={undefined} checked={true} readOnly disabled></Checkbox>
            </div>

            <p color="blue-gray">State : {card.current_status}</p>

            <Popover placement="right-start">
              <PopoverHandler>
                <Button className='w-auto p-2'>History</Button>
              </PopoverHandler>
              <PopoverContent>
                <div>
                  <table className='border-separate border-spacing-x-1'>
                    {
                      Object.values(card.teams).map((team: any) =>
                        <tr key={team.id}>
                          <td>{team.name}</td>
                          <td>{team.final_mark}</td>
                          <td>{shortDate(team.updated_at)}</td>
                        </tr>
                      )
                    }
                  </table>
                </div>
              </PopoverContent>
            </Popover>
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
          <Typography className="font-normal">{longDate(card.current_updated_at)}</Typography>
        </CardFooter>
      </Card>
    );
  }

  React.useEffect(() => {
    axios
      .get('/?page=projects&action=get_teams',
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

  const subOptions = useMemo(() => (
    <>
      <div className='flex flex-wrap gap-2 justify-evenly'>

        {filters && Object.entries(filters).map((filter) => {
          return (
            <Button
              key={filter[0]}
              className={classNames(filter[1] === currentFilter ? 'selected-option' : 'available-option' )}
              onClick={() => { setCurrentFilter((prev) => prev !== filter[0] ? filter[0] : undefined); } }
            >
              {filter[1]}
            </Button>
          );
        })}
      </div>
      <Separator></Separator>
    </>

  ), [currentFilter, filters]);

  const displayValues = useMemo(() => {

    if (values === undefined) {
      return [];
    }

    return values.filter((team) => {

      if (currentFilter === undefined || team.project_slug === currentFilter) {
        return true;
      }
      return false;
    });
  }, [currentFilter, values]);

  //
  return (
    <div className='my-content'>
      {(values) &&
        <SuperCards
          values={displayValues || []}
          customCard={TeamCard}

          subOptions={subOptions}

          tableTitle='Teams'
          tableDesc={'Teams projects'}
          options={[25, 50, 100]}
          // reloadFunction={() => { setValues([]); }}
        />
      }
    </div>
  );
}
