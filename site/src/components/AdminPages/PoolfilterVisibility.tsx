import React, { useCallback } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Checkbox,
} from '@material-tailwind/react';
import { SuperTable } from 'Common/SuperTable';
import { useNotification } from 'Notifications/NotificationsProvider';

class ColumnProps {
  field: string = '';
  label: string = '';
}

export function PoolfilterVisibilityPage(): JSX.Element {
  const { addNotif } = useNotification();
  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  const changePermission = useCallback((poolfilterId: number, value: boolean): Promise<boolean> => {
    return axios
      .post('/?page=admin&action=poolfilter_set',
        `poolfilterId=${poolfilterId}&value=${value}`, { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          // localStorage.setItem('token', res.data.access_token);
        } //
        return true;
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
        return false;
      });
  }, [addNotif]);

  React.useEffect(() => {
    axios
      .get('/?page=admin&action=poolfilters_get',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          if (res.data.values.length > 0) {
            setColumns(res.data.columns as ColumnProps[]);

            const displayValues = res.data.values.map((poolfilter: any) => {
              res.data.columns.forEach((col: ColumnProps) => {
                if (col.field === 'hidden') {

                  poolfilter[col.field] = <Checkbox
                    id={`${poolfilter.id}-${col.field}`}
                    defaultChecked={poolfilter[col.field]}
                    onClick={async (e: any) => {
                      if (!(await changePermission(poolfilter.id, e.target.checked))) {
                        e.target.checked = !e.target.checked;
                      }
                    }}
                  />;
                }
              });

              return poolfilter;
            });
            setValues(displayValues);
          }
          else {
            addNotif('No results found', 'error');
          }
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif, changePermission]);


  return (
    <div className='mx-8 mt-2'>
      {(columns && values) &&
        <SuperTable
          columns={columns}
          values={values}
          tableTitle='Poolfilters'
          options={[10, 20, 30]}
          reloadFunction={() => { setValues([]); }}
        />
      }
    </div>
  );
}
