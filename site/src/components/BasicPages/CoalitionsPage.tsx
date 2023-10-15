import React from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Card,
  CardBody,
  CardHeader,
  Dialog,
  DialogBody,
  DialogHeader,
} from '@material-tailwind/react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { SuperCards } from 'Common/SuperCards';
import { AiOutlineClose } from 'react-icons/ai';


export function CoalitionsPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [values, setValues] = React.useState<any[] | undefined>(undefined);
  const [focusText, setFocusText] = React.useState<string | undefined>(undefined);
  const [focusImage, setFocusImage] = React.useState<string | undefined>(undefined);


  React.useEffect(() => {
    axios
      .get('/?page=basic&action=get_coalitions',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setValues(res.data.values);
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

        <CardBody className="flex flex-row grow gap-2 bg-white/50 text-center align-center mt-2 p-2">

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
              {card.campus_name} - {card.cursus_name}
            </p>
          </div>

        </CardBody>
      </Card>
    );
  }

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
