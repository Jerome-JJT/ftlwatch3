import React, { useMemo } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import { SuperTable } from 'Common/SuperTable';
import { useNotification } from 'Notifications/NotificationsProvider';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@material-tailwind/react';
import Separator from 'Common/Separator';
import classNames from 'classnames';
import { comparePoolfilters } from 'Utils/comparePoolfilters';

class ColumnProps {
  field: string = '';
  label: string = '';
}


export function CampusPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);


  React.useEffect(() => {
    axios
      .get('/?page=basic&action=get_campus',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          if (res.data.values.length > 0) {
            setColumns(res.data.columns as ColumnProps[]);

            const displayValues = res.data.values.map((user: any) => {
              res.data.columns.forEach((col: ColumnProps) => {
                // if (col.field === 'login') {
                //   user[col.field] = <a
                //     href={`https://profile.intra.42.fr/users/${user.login}`}
                //   >{user.login}</a>;
                // }
                // else if (col.field === 'avatar_url') {
                //   user[col.field] = <img
                //     src={user[col.field]}
                //     alt={user.login}
                //     className='max-h-full max-w-[60px] rounded-lg'
                //   />;
                // }
              });

              return user;
            });
            setValues(displayValues);
          }
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif]);


  return (
    <div className='mx-8 mt-2'>
      {(columns && values) &&
        <SuperTable
          columns={columns}
          values={values}


          tableTitle='Campus'
          options={[10, 25, 50, 100]}
          reloadFunction={() => { setValues([]); }}
        />
      }
    </div>
  );
}
