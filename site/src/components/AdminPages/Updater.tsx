import React, { useCallback } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Button,
} from '@material-tailwind/react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { commonTitle } from 'Utils/commonTitle';
import { SuperCards } from 'Common/SuperCards';


function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i: number) {
  const c = (i & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();
  return '00000'.substring(0, 6 - c.length) + c;
}



export function UpdaterPage(): JSX.Element {
  const { addNotif } = useNotification();
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Updater page');}, []);

  function updateButton(data: any): JSX.Element {

    const colorSeed = hashCode(data.id);
    const color = intToRGB(colorSeed);

    return (
      <Button style={{ backgroundColor: `#${color}` }} onClick={() => { onUpdate(data.id); }}>
        {data.name}
      </Button>
    );
  }

  const onUpdate = useCallback((updateId: string): Promise<boolean> => {
    return axios
      .post('/?page=update&action=update', `target=${updateId}`, { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 204) {
          addNotif('Update sent', 'success');
        }
        return true;
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
        return false;
      });
  }, [addNotif]);

  React.useEffect(() => {
    axios
      .get('/?page=update&action=get',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setValues(res.data.values as any[]);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif]);



  return (
    <div className='my-content'>
      {(values) &&
        <SuperCards
          values={values}
          customCard={updateButton}

          tableTitle='Updates'
          options={[25]}
        />
      }
    </div>
  );
}

