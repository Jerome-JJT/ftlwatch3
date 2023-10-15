import React, { useCallback } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import { Input, Button } from '@material-tailwind/react';

import { SuperTable } from 'Common/SuperTable';
import { useNotification } from 'Notifications/NotificationsProvider';
import MySelect from 'Common/MySelect';
import { ColumnProps } from 'Utils/columnsProps';



export function PagePermissionsPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  const modifyPageOrder = useCallback((pageId: number, order: string): Promise<boolean> => {
    return axios
      .post('/?page=admin&action=page_set',
        `pageId=${pageId}&order=${order}`, { withCredentials: true }
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
  }, [addNotif]);

  const modifyPagePermission = useCallback((pageId: number, permissionId: string): Promise<boolean> => {
    return axios
      .post('/?page=admin&action=page_set',
        `pageId=${pageId}&permissionId=${permissionId}`, { withCredentials: true }
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
  }, [addNotif]);

  React.useEffect(() => {
    axios
      .get('/?page=admin&action=pages_get',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setColumns(res.data.columns as ColumnProps[]);

          const displayValues = res.data.values.map((page: any) => {
            res.data.columns.forEach((col: ColumnProps) => {
              if (col.field === 'corder') {
                const corderId = `corder-${page.id}`;
                page[col.field] =
                    <div className="relative flex w-full max-w-[24rem]">
                      <Input id={corderId} label='corder' type='text' defaultValue={page[col.field]}/>
                      <Button
                        size="sm"
                        className="!absolute right-1 top-1 rounded"
                        onClick={() => { void modifyPageOrder(page.id, (document.getElementById(corderId) as HTMLInputElement).value || '98'); }}
                      >
                        Save
                      </Button>
                    </div>;
              }

              else if (col.field === 'permission') {
                page[col.field] = <MySelect
                  defaultValue={page.permission_id?.toString() || 'null'}
                  onChange={(v) => { void modifyPagePermission(page.id, v.target.value || 'null'); }}>

                  <option key='null' value='null'>null</option>
                  {res.data.permission_options.map((perm: any) => {
                    return <option key={perm.id} value={perm.id.toString()}>{perm.name}</option>;
                  })}

                </MySelect>;
              }
            });

            return page;
          });
          setValues(displayValues);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif, modifyPageOrder, modifyPagePermission]);

  //
  return (
    <div className='mx-8 mt-2'>
      {(columns && values) &&
        <SuperTable
          columns={columns}
          values={values}
          tableTitle='Pages'
          options={[10, 20, 30]}
          // reloadFunction={() => { setValues([]) }}
        />
      }
    </div>
  );
}
