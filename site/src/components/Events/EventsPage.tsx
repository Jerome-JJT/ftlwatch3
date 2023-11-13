import React from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Dialog,
  DialogBody,
  DialogHeader,
} from '@material-tailwind/react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { SuperCards } from 'Common/SuperCards';
import { commonTitle } from 'Utils/commonTitle';
import { AiOutlineClose } from 'react-icons/ai';



export function EventPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [values, setValues] = React.useState<any[] | undefined>(undefined);
  const [focusEvent, setFocusEvent] = React.useState<any | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Event page');}, []);



  function EventCard(card: any): JSX.Element {
    return (
      <Card id={card.login} key={card.login} className="flex min-w-96 w-96 max-w-96 border-black border-2">
        <CardHeader floated={false} title={card.name} className='flex justify-center shadow-none mx-2 mt-2 bg-black/10 my-text truncate'>
          {card.name}
        </CardHeader>

        <CardBody className="grid grid-cols-2 grow gap-4 text-center align-center p-2">

          <div className='blue-gray grid grid-cols-2 gap-1 place-content-start'>
            <p>Kind</p>
            <p>{card.kind}</p>

            <p>Peoples</p>
            <p>{card.users.length} / {card.max_people !== -1 ? card.max_people : '∞'}</p>
          </div>

          <div className='blue-gray grid grid-cols-2 gap-1 place-content-start grow'>

            <p>Cursus 21</p>
            <div><Checkbox containerProps={{ className: 'p-0' }} checked={card.has_cursus21} readOnly disabled /></div>

            <p>Cursus 9</p>
            <div><Checkbox containerProps={{ className: 'p-0' }} checked={card.has_cursus9} readOnly disabled /></div>


          </div>

          <p>Location</p>
          <p>{card.location}</p>

          <p>Begin at</p>
          <p>{card.begin_at}</p>

          <p>End at</p>
          <p>{card.end_at}</p>

          <textarea className='w-full col-span-2 grow border p-2' rows={3} readOnly defaultValue={card.description} />
        </CardBody>

        <CardFooter className="pt-0 flex justify-center pb-4">
          <Button onClick={() => setFocusEvent(card)}>Subsrcibers ({card.users.length})</Button>
        </CardFooter>
      </Card>
    );
  }


  React.useEffect(() => {
    axios
      .get('/?page=events&action=get',
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


  //
  return (
    <div className='my-content'>
      {(values) &&
        <SuperCards
          values={values}
          customCard={EventCard}

          tableTitle='Events'
          options={[10, 25, 50, 100]}
          // reloadFunction={() => { setValues([]); }}
        />
      }
      <Dialog open={focusEvent !== undefined} handler={() => setFocusEvent(undefined)}>
        <div className="flex flex-row items-center justify-between pr-4">

          <DialogHeader className='grow w-96 truncate' title={focusEvent?.name || ''}>{focusEvent?.name || ''}</DialogHeader>
          <AiOutlineClose onClick={() => setFocusEvent(undefined)}
            className='rounded-lg border-transparent border-2 hover:bg-gray-100 hover:border-black hover:text-red-500' size='30' />
        </div>

        <DialogBody className='grid grid-cols-4 auto-cols-max gap-6 justify-center mb-2' divider>
          {
            focusEvent?.users.map((user: string) => <><p>{user}</p></>)
          }
        </DialogBody>
      </Dialog>
    </div>
  );
}
