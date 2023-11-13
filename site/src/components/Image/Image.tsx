import React, { useMemo } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@material-tailwind/react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { useSearchParams } from 'react-router-dom';
import { SuperCards } from 'Common/SuperCards';
import Separator from 'Common/Separator';
import classNames from 'classnames';
import { comparePoolfilters } from 'Utils/comparePoolfilters';
import { commonTitle } from 'Utils/commonTitle';


class PoolFilterProps {
  id: string = '';
  name: string = '';
  hidden: boolean = true;
}



export function ImagePage(): JSX.Element {
  const { addNotif } = useNotification();
  const [searchParams] = useSearchParams();
  const defaultFilter = searchParams.get('filter');

  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  const [usedFilter, setUsedFilter] = React.useState<string | undefined>(defaultFilter !== null ? defaultFilter : 'cursus');
  const [poolFilters, setPoolFilters] = React.useState<PoolFilterProps[] | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Image page');}, []);



  function ImageCard(card: any): JSX.Element {
    return (
      <Card id={card.login} key={card.login} className="flex min-w-48 w-48 max-w-48 h-80 border-black border-2">
        <CardHeader floated={false} className='flex h-48 min-h-48 justify-center shadow-none mx-2 mt-2 bg-transparent my-text'>
          <img className='max-h-full rounded-lg object-contain' src={card.avatar_url} alt="profile-picture" />
        </CardHeader>

        <CardBody className="flex grow justify-evenly flex-col text-center align-center p-2">

          <div>
            <p color="blue-gray" className="mb-1">
              {card.first_name} {card.last_name}
            </p>
          </div>

          <div>
            <p color="blue-gray" className="mb-1">
              {card.poolfilter}
            </p>
          </div>
        </CardBody>

        <CardFooter className="pt-0 flex justify-center pb-4">
          <a href={`https://profile.intra.42.fr/users/${card.login}`}><Button>{card.login}</Button></a>
        </CardFooter>
      </Card>
    );
  }


  React.useEffect(() => {
    window.history.replaceState(null, '', `/image?${usedFilter ? `filter=${usedFilter}` : ''}`);

    axios
      .get(`/?page=image&action=get${usedFilter ? `&filter=${usedFilter}` : ''}`,
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setPoolFilters(() => {
            const pf = res.data.poolfilters as PoolFilterProps[];
            pf.sort((a, b) => comparePoolfilters(a.name, b.name));
            return pf;
          });

          setValues(res.data.values);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif, usedFilter]);

  const subOptions = useMemo(() => (
    <>
      <div className='flex flex-wrap gap-2 justify-evenly'>

        {poolFilters && poolFilters.map((filter) => {
          return (
            <Button
              key={filter.name}
              className={classNames(filter.name === usedFilter ? 'selected-option' : (filter.hidden ? 'hidden-option' : 'available-option' ))}
              //  className="inline-block rounded-full bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
              onClick={() => { setUsedFilter((prev) => prev !== filter.name ? filter.name : undefined); } }
            >
              {filter.name}
            </Button>
          );
        })}
      </div>
      <Separator></Separator>
    </>

  ), [poolFilters, usedFilter]);

  //
  return (
    <div className='my-content'>
      {(values) &&
        <SuperCards
          values={values}
          customCard={ImageCard}

          subOptions={subOptions}

          tableTitle='Images'
          options={[10, 25, 50, 100]}
          // reloadFunction={() => { setValues([]); }}
        />
      }
    </div>
  );
}
