import { Button } from '@material-tailwind/react';
import { useNotification } from '../Notifications/NotificationsProvider';

export default function TestPage (): JSX.Element {
  const { addNotif } = useNotification();

  return (
    <div className="mx-auto h-max max-w-md bg-white py-6 text-center shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-white">
      <h1 id="startPage" className="text-2xl">
        Test page
      </h1>

      <Button onClick={() => { addNotif('test', 'success', 0) }}>Success</Button>
      <Button onClick={() => { addNotif('test', 'warning', 0) }}>Warning</Button>
      <Button onClick={() => { addNotif('test', 'error', 0) }}>Error</Button>
      <Button onClick={() => { addNotif('test', 'info', 0) }}>Info</Button>
      <Button onClick={() => { addNotif('test', 'question', 0) }}>Question</Button>

    </div>
  );
}
