import React from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Dialog,
  DialogBody,
  DialogHeader,
} from '@material-tailwind/react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { useSearchParams } from 'react-router-dom';
import { SuperCards } from 'Common/SuperCards';
import { AiOutlineClose } from 'react-icons/ai';


export function AchievementsPage(): JSX.Element {
  const { addNotif } = useNotification();
  const [searchParams] = useSearchParams();
  // const defaultFilter = searchParams.get('filter');

  const [values, setValues] = React.useState<any[] | undefined>(undefined);
  const [focusText, setFocusText] = React.useState<string | undefined>(undefined);
  const [focusImage, setFocusImage] = React.useState<string | undefined>(undefined);

  // const [usedFilter, setUsedFilter] = React.useState<string | undefined>(defaultFilter !== null ? defaultFilter : 'cursus');

  React.useEffect(() => {
    axios
      .get('/?page=basic&action=get_achievements',
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



  function CchievementCard(card: any): JSX.Element {
    console.log(card);
    return (
      <Card key={card.id}
        className="flex w-80 h-80 border-black border-2 overflow-hidden"
        style={{ backgroundColor: card.color }}>

        <CardHeader floated={false}
          className='flex flex-row min-h-32 h-32 max-h-32 gap-4 justify-start bg-transparent shadow-none mx-2 mt-2'>

          <img className='max-h-full rounded-lg object-contain'
            src={card.image && `https://cdn.intra.42.fr/${card.image.replace('/uploads/', '')}`} />

          <div className='flex flex-col justify-around'>
            <p color="blue-gray">
              {card.achievement_name}
            </p>

            <p color="blue-gray">
              Kind: {card.kind}
            </p>

            <div color="blue-gray" className="flex items-center">
              <p>Visible</p> <Checkbox checked={card.has_lausanne} readOnly disabled></Checkbox>
            </div>

          </div>

        </CardHeader>

        <CardBody className="flex flex-row grow gap-2text-center align-center mt-2 p-2">

          {/* <div className='min-w-20 w-20 max-w-20 flex align-center justify-center'>
            <img className='max-h-full max-w-full rounded-lg object-contain border-2 border-transparent cursor-pointer hover:border-white'
              src={card.image_url}
              onClick={() => {setFocusImage(card.image_url); setFocusText(card.name);}} />

          </div> */}

          <div className="flex flex-col grow p-2 justify-evenly text-black">

            <p color="blue-gray" className="mb-1">
              {card.description}
            </p>
            <p color="blue-gray" className="mb-1">
              {card.campus_name} {card.cursus_name}
            </p>
          </div>

        </CardBody>
      </Card>
    );
  }


  return (
    <div className='mx-8 mt-2'>
      {(values) &&
        <SuperCards
          values={values}
          customCard={CchievementCard}

          tableTitle='Achievements'
          options={[10, 25, 50, 100]}
          reloadFunction={() => { setValues([]); }}
        />
      }
      {/* <Dialog open={focusImage !== undefined} handler={() => setFocusImage(undefined)}>
        <div className="flex items-center justify-between pr-4">
          <DialogHeader>{focusText || ''}</DialogHeader>
          <AiOutlineClose onClick={() => setFocusImage(undefined)}
            className='rounded-lg border-transparent border-2 hover:bg-gray-100 hover:border-black hover:text-red-500' size='30' />
        </div>
        <DialogBody className='flex justify-center' divider>
          <img className='max-h-[400px]' src={focusImage && `https://cdn.intra.42.fr/${focusImage.replace('/uploads/', '')}`}/>
        </DialogBody>
      </Dialog> */}
    </div>
  );
}
