import React from 'react';
import { type UseLoginDto } from '../Hooks/useLogin';
import axios from 'axios';
import { AxiosErrorText } from '../Hooks/AxiosErrorText';
import {
  Checkbox
} from '@material-tailwind/react';
import { SuperTable } from '../Common/SuperTable';
import { useNotification } from '../Notifications/NotificationsProvider';

interface GroupsProps {
  loginer: UseLoginDto
}

class ColumnProps {
  field: string = ''
  label: string = ''
}

export function GroupsPage ({
  loginer
}: GroupsProps): JSX.Element {
  const { addNotif } = useNotification();

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  const changePermission = async (userId: number, groupId: number, value: boolean): Promise<boolean> => {
    return await axios
      .post('/?page=permissions&action=group_set',
        `userId=${userId}&groupId=${groupId}&value=${value}`, { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          // addNotif('teest2', 'question', false);
        } //
        return true;
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
        return false;
      });
  }

  React.useEffect(() => {
    axios
      .get('/?page=permissions&action=groups_get',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          if (res.data.values.length > 0) {
            setColumns(res.data.columns as ColumnProps[]);

            const displayValues = res.data.values.map((userWithGroups: any) => {
              Object.keys(userWithGroups).forEach((colKey) => {
                if (colKey !== 'id' && colKey !== 'login') {
                  userWithGroups[colKey] = <Checkbox
                    id={`${userWithGroups.id}-${colKey}`}
                    defaultChecked={userWithGroups[colKey]}
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={async (e: any) => {
                      if (!(await changePermission(userWithGroups.id, parseInt(colKey), e.target.checked))) {
                        e.target.checked = !e.target.checked;
                      }
                    }}
                  />
                }
              })

              return userWithGroups
            })
            setValues(displayValues);
          }
          else {
            addNotif('No results found', 'error');
          }
        }
      })
      .catch((error) => {
        return AxiosErrorText(error);
      });
  }, [])

  //
  return (
    <div className='mx-8 mt-2'>
      {(columns && values) &&
        <SuperTable
          columns={columns}
          values={values}
          tableTitle='Groups'
          options={[1, 2, 3]}
          reloadFunction={() => { setValues([]) }}
        />
      }
    </div>
  );
}
