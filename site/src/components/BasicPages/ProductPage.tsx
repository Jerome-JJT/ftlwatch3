import React from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  DialogBody,
  DialogHeader,
} from '@material-tailwind/react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { SuperCards } from 'Common/SuperCards';
import { AiFillDollarCircle, AiOutlineClose } from 'react-icons/ai';
import { FaInfinity } from 'react-icons/fa';
import Separator from 'Common/Separator';
import { commonTitle } from 'Utils/commonTitle';


export function ProductsPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [values, setValues] = React.useState<any[] | undefined>(undefined);
  const [focusText, setFocusText] = React.useState<string | undefined>(undefined);
  const [focusImage, setFocusImage] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Products page');}, []);

  React.useEffect(() => {
    axios
      .get('/?page=basic&action=get_products',
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



  function ProductCard(card: any): JSX.Element {
    return (
      <Card key={card.id}
        className="flex w-96 border-black border-2">

        <CardHeader floated={false}
          className='flex h-40 justify-center bg-transparent shadow-none mx-2 mt-2'>

          <img className='h-full rounded-lg object-contain border-2 border-transparent cursor-pointer hover:border-black'
            src={card.image && `https://cdn.intra.42.fr/${card.image.replace('/uploads/', '')}`}
            onClick={() => {setFocusImage(card.image); setFocusText(card.name);}} />
        </CardHeader>

        <Separator className='my-1' />

        <CardBody className="flex flex-row grow gap-2 p-3 text-center align-center">

          <div className="flex flex-col grow justify-evenly rounded-lg bg-white/50 dark:bg-gray-600 text-black">

            <div color="blue-gray" className="mb-1 flex flex-row gap-x-2 flex-wrap justify-around">
              <p className='flex align-center'>
                {card.name}
              </p>
              <p className='flex align-center'>
                Price: {card.price}<AiFillDollarCircle className='p-1' size='24'/>
              </p>
              <p className='flex align-center'>
                Quantity: {card.quantity || <FaInfinity className='p-1' size='24'/>}
              </p>
            </div>

            <textarea readOnly className='my-text bg-transparent border dark:border-gray-700 p-1 w-full' rows={6}>

              {card.description}
            </textarea>
          </div>
        </CardBody>

        <CardFooter className="pt-0 flex justify-center pb-4">
          <p color="blue-gray">
            {card.slug}
          </p>
        </CardFooter>
      </Card>
    );
  }


  //
  return (
    <div className='my-content'>
      {(values) &&
        <SuperCards
          values={values}
          customCard={ProductCard}

          tableTitle='Products'
          tableDesc='Products from shops intra all around the world'
          options={[10, 25, 50, 100]}
          // reloadFunction={() => { setValues([]); }}
        />
      }
      <Dialog open={focusImage !== undefined} handler={() => setFocusImage(undefined)}>
        <div className="flex items-center justify-between pr-4">
          <DialogHeader>{focusText || ''}</DialogHeader>
          <AiOutlineClose onClick={() => setFocusImage(undefined)}
            className='rounded-lg border-transparent border-2 hover:bg-gray-100 hover:border-black hover:text-red-500' size='30' />
        </div>
        <DialogBody className='flex justify-center' divider>
          <img className='max-h-[400px]' src={focusImage && `https://cdn.intra.42.fr/${focusImage.replace('/uploads/', '')}`}/>
        </DialogBody>
      </Dialog>
    </div>
  );
}
