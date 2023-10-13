import React, { useMemo } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  DialogBody,
  DialogHeader,
} from '@material-tailwind/react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { useSearchParams } from 'react-router-dom';
import { SuperCards } from 'Common/SuperCards';
import Separator from 'Common/Separator';
import classNames from 'classnames';
import { comparePoolfilters } from 'Utils/comparePoolfilters';
import { AiOutlineClose } from 'react-icons/ai';


export function CoalitionsPage(): JSX.Element {
  const { addNotif } = useNotification();
  const [searchParams] = useSearchParams();
  // const defaultFilter = searchParams.get('filter');

  const [values, setValues] = React.useState<any[] | undefined>(undefined);
  const [focusText, setFocusText] = React.useState<string | undefined>(undefined);
  const [focusImage, setFocusImage] = React.useState<string | undefined>(undefined);

  // const [usedFilter, setUsedFilter] = React.useState<string | undefined>(defaultFilter !== null ? defaultFilter : 'cursus');

  React.useEffect(() => {
    axios
      .get('/?page=basic&action=get_coalitions',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          if (res.data.values.length > 0) {

            setValues(res.data.values);
          }
          else {
            addNotif('No results found', 'error');
          }
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif]);



  function CoalitionCard(card: any): JSX.Element {
    return (
      <Card key={card.id}
        className="flex w-80 h-80 border-black border-2 overflow-hidden"
        style={{ backgroundColor: card.color }}>

        <CardHeader floated={false}
          className='flex min-h-40 h-40 max-h-40 justify-center bg-transparent shadow-none mx-2 mt-2'>

          <img className='max-h-full rounded-lg object-contain border-2 border-transparent cursor-pointer hover:border-white'
            src={card.cover_url}
            onClick={() => {setFocusImage(card.cover_url); setFocusText(card.name);}} />
        </CardHeader>

        <CardBody className="flex flex-row grow gap-2 bg-white/50 rounded-lg text-center align-center mt-2 p-2">

          <div className='min-w-20 w-20 max-w-20 flex align-center justify-center'>
            <img className='max-h-full max-w-full rounded-lg object-contain border-2 border-transparent cursor-pointer hover:border-white'
              src={card.image_url}
              onClick={() => {setFocusImage(card.image_url); setFocusText(card.name);}} />

          </div>

          <div className="flex flex-col grow p-2 justify-evenly text-black">
            <p color="blue-gray" className="mb-1">
              {card.name}
            </p>
            <p color="blue-gray" className="mb-1">
              {card.slug}
            </p>
            <p color="blue-gray" className="mb-1">
              {card.campus_name} {card.cursus_name}
            </p>
          </div>

          {/* <div>
          <p color="blue-gray" className="mb-1">
            {card.poolfilter}
          </p>
        </div> */}
        </CardBody>

        {/* <CardFooter className="pt-0 flex justify-center pb-4">
        <a href={`https://profile.intra.42.fr/cards/${card.login}`}><Button>{card.login}</Button></a>
      </CardFooter> */}
      </Card>
    );
  }

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
    <div className='mx-8 mt-2'>
      {(values) &&
        <SuperCards
          values={values}
          customCard={CoalitionCard}

          // subOptions={subOptions}

          tableTitle='Coalitions'
          options={[10, 25, 50, 100]}
          reloadFunction={() => { setValues([]); }}
        />
      }
      <Dialog open={focusImage !== undefined} handler={() => setFocusImage(undefined)}>
        <div className="flex items-center justify-between pr-4">
          <DialogHeader>{focusText || ''}</DialogHeader>
          <AiOutlineClose onClick={() => setFocusImage(undefined)}
            className='rounded-lg border-transparent border-2 hover:bg-gray-100 hover:border-black hover:text-red-500' size='30' />
        </div>
        <DialogBody className='flex justify-center' divider>
          <img className='max-h-[400px]' src={focusImage}/>
        </DialogBody>
      </Dialog>
    </div>
  );
}
