import React from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
} from '@material-tailwind/react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { SuperCards } from 'Common/SuperCards';
import { AiFillGift } from 'react-icons/ai';
import { commonTitle } from 'Utils/commonTitle';


export function AchievementsPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Achievements page');}, []);

  React.useEffect(() => {
    axios
      .get('/?page=basic&action=get_achievements',
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



  function AchievementCard(card: any): JSX.Element {
    return (
      <Card key={card.id}
        className="flex w-80 h-80 border-black border-2 overflow-hidden">

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
              <p>Visible</p> <Checkbox crossOrigin={undefined} checked={card.has_lausanne} readOnly disabled></Checkbox>
            </div>

          </div>

        </CardHeader>

        <CardBody className="flex flex-row grow gap-2text-center align-center mt-2 p-2">

          <div className="flex flex-col grow p-2 justify-evenly text-black">
            <p color="blue-gray">
              {card.description}
            </p>
            {
              card.title_name && <p color="blue-gray" className="flex gap-1 items-center">
                <AiFillGift size='24'/> {card.title_name}
              </p>
            }
          </div>

        </CardBody>
      </Card>
    );
  }


  return (
    <div className='my-content'>
      {(values) &&
        <SuperCards
          values={values}
          customCard={AchievementCard}

          tableTitle='All possible achievements'
          tableDesc='List of all existing achievements, some might not be visible at 42lausanne'
          options={[25, 50, 100]}
          // reloadFunction={() => { setValues([]); }}
        />
      }
    </div>
  );
}
