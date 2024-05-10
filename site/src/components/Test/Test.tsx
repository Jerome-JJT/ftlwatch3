import { Button, Checkbox, Radio } from '@material-tailwind/react';
import AsgardMap from 'Maps/AsgardMap';
import GothamMap from 'Maps/GothamMap';
import SsdMap from 'Maps/SsdMap';
import { useNotification } from 'Notifications/NotificationsProvider';

export default function TestPage(): JSX.Element {
  const { addNotif } = useNotification();



  const scrip = {
    'sizes': [
      { id: 'L', name: 'Tacos L', price: '10.-', desc: '(1 tortilla - 1 viande)' },
      { id: 'Lm', name: 'Tacos L mixte', price: '11.-', desc: '(1 tortilla - 3 viandes)' },
    ],
    'meats': [
      { id: 'hached', name: 'Viande hachée', desc: '(boeuf)' },
      { id: 'chicken', name: 'Escalope de poulet' },
    ],
    'garnitures': [
      { id: 'fries', name: 'Frites' },
      { id: 'cheddar', name: 'Cheddar' },
    ],
    'sauces': [
      { id: 'fromagere', name: 'Fromagère' },
      { id: 'ketchup', name: 'Ketchup' },
    ],
  };



  function Textbox(props: { name: string, list: any[], max: number, size: number, className: string }): JSX.Element {


    return (
      <div className='flex flex-row'>


      </div>


    );
  }

  return (
    <div className="mx-auto min-h-96 max-w-md bg-white py-6 text-center shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-white">
      <h1 id="startPage" className="text-2xl">
        Test page
      </h1>

      <Button onClick={() => { addNotif('test', 'success', 0); }}>Success</Button>
      <Button onClick={() => { addNotif('test', 'warning', 0); }}>Warning</Button>
      <Button onClick={() => { addNotif('test', 'error', 0); }}>Error</Button>
      <Button onClick={() => { addNotif('test', 'info', 0); }}>Info</Button>
      <Button onClick={() => { addNotif('test', 'question', 0); }}>Question</Button>


      {/* <GothamMap id='test' />
      <AsgardMap id='test' />
      <SsdMap id='test' /> */}



      <div className="flex flex-col gap-8">
        <Radio
          crossOrigin={undefined}
          name="description"
          label={
            <div>
              <p color="blue-gray" className="font-medium">
              HTML Version
              </p>
              <p color="gray" className="font-normal">
              @material-tailwind/html, packed with rich components and widgets.
              </p>
            </div>
          }
          containerProps={{
            className: '-mt-5',
          }}
        />
        <Radio
          crossOrigin={undefined}
          name="description"
          defaultChecked
          label={
            <div>
              <p color="blue-gray" className="font-medium">
              React Version
              </p>
              <p color="gray" className="font-normal">
              @material-tailwind/react, packed with rich components and widgets.
              </p>
            </div>
          }
          containerProps={{
            className: '-mt-5',
          }}
        />
      </div>


      <div className="flex flex-col gap-8">
        <Checkbox
          crossOrigin={undefined}
          name="description"
          label={
            <div>
              <p color="blue-gray" className="font-medium">
              HTML Version
              </p>
              <p color="gray" className="font-normal">
              @material-tailwind/html, packed with rich components and widgets.
              </p>
            </div>
          }
          containerProps={{
            className: '-mt-5',
          }}
        />
        <Checkbox
          crossOrigin={undefined}
          name="description"
          className='rounded-full'
          defaultChecked
          label={
            <div>
              <p color="blue-gray" className="font-medium">
              React Version
              </p>
              <p color="gray" className="font-normal">
              @material-tailwind/react, packed with rich components and widgets.
              </p>
            </div>
          }
          containerProps={{
            className: '-mt-5',
          }}
        />
      </div>





      <div>

        <div className='min-h-60 grid gap-x-0 grid-cols-4 box-border p-2'>
          <div className='bg-blue-300 border border-black box-border'>
            <div className='bg-red-400 h-10 border border-black box-border'>
              Taille
            </div>
            <div className='bg-white h-60 border border-black box-border'>
              Taille
            </div>
          </div>
          <div className='bg-blue-300'>02</div>
          <div className='bg-blue-300'>03</div>
          <div className='bg-blue-300'>04</div>
        </div>


      </div>
    </div>
  );
}
