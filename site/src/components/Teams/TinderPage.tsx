import React from 'react';
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
import { AiFillStar } from 'react-icons/ai';
import { longDate, shortDate } from 'Utils/dateUtils';
import { commonTitle } from 'Utils/commonTitle';





export function TinderPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Tinder');}, []);

  function TinderCard(card: any): JSX.Element {

    const users = Object.values(card.users);
    users.sort((a: any, _b: any) => {
      return a.id === card.leader_id ? 1 : 0;
    });


    return (
      <Card className="flex min-w-80 w-80 max-w-80 h-52 border-black border-2">

        <CardBody className="flex flex-row grow justify-evenly text-center align-center p-2">

          <div className='flex flex-col justify-evenly'>
            <p color="blue-gray">
            </p>
            <p color="blue-gray">
            </p>
          </div>

          <div className='flex flex-col justify-evenly'>
            <div className="flex items-center">
            </div>

            <p color="blue-gray">
              Mark :
            </p>

          </div>
        </CardBody>

        <CardFooter className="flex items-center bg-black/20 justify-between p-3 pb-1">
          <div className="flex items-center -space-x-3">
          </div>
          <Typography className="font-normal">fasfasfasf</Typography>
        </CardFooter>
      </Card>
    );
  }

  React.useEffect(() => {
    axios
      .get('/?page=teams&action=get_tinder',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setValues(res.data.filters);
          setValues(res.data.values);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif]);

  // const subOptions = useMemo(() => (
  //   <>
  //     <div className='flex flex-wrap gap-2 justify-evenly'>

  //       {poolFilters && poolFilters.map((filter) => {
  //         return (
  //           <Button
  //             key={filter.id}
  //             className={classNames(filter.name === usedFilter ? 'bg-blue-900' : (filter.hidden ? 'bg-blue-200' : 'bg-blue-700' ))}
  //             //  className="inline-block rounded-full bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
  //             onClick={() => { setUsedFilter((prev) => prev !== filter.name ? filter.name : undefined); } }
  //           >
  //             {filter.name}
  //           </Button>
  //         );
  //       })}
  //     </div>
  //     <Separator></Separator>
  //   </>

  // ), [poolFilters, usedFilter]);

  //
  return (
    <div className='my-content'>
      {(values) &&
        <SuperCards
          values={values}
          customCard={TinderCard}

          // subOptions={subOptions}

          tableTitle='Tinder'
          options={[10, 25, 50, 100]}
          reloadFunction={() => { setValues([]); }}
        />
      }
    </div>
  );
}
