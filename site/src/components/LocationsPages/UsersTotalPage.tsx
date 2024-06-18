import React, { useMemo } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import { SuperTable } from 'Common/SuperTable';
import { useNotification } from 'Notifications/NotificationsProvider';
import { ColumnProps } from 'Utils/columnsProps';
import { commonTitle } from 'Utils/commonTitle';
import { Button } from '@material-tailwind/react';
import classNames from 'classnames';
import Separator from 'Common/Separator';



export function UsersTotalPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Users total');}, []);


  React.useEffect(() => {
    axios
      .get('/?page=locations&action=get_users_totals',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setColumns((prev) =>
            (res.data.columns as ColumnProps[]).map((c) => ({
              ...c,
              visible: prev?.find((cf) => cf.field === c.field)?.visible ?? (c.visible ?? true),
            }))
          );

          const displayValues = res.data.values.map((user: any) => {
            res.data.columns.forEach((col: ColumnProps) => {
              if (col.field === 'login') {
                user['_login'] = user.login;
                user[col.field] = <a
                  href={`https://profile.intra.42.fr/users/${user.login}`}
                >{user.login}</a>;
              }
            });

            return user;
          });
          setValues(displayValues);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif]);

  const subOptions = useMemo(() => (
    <>
      <div className='flex flex-wrap gap-2 justify-evenly max-h-80 overflow-y-auto'>

        <Button
          key={'all'}
          className='available-option'

          onClick={() =>
            setColumns((prev) => prev && prev.map((pc) => {
              return { ...pc, visible: true };
            }))
          }
        >
          All
        </Button>

        <Button
          key={'none'}
          className='available-option'

          onClick={() =>
            setColumns((prev) => prev && prev.map((pc) => {
              return { ...pc, visible: false };
            }))
          }
        >
          None
        </Button>

        {columns && columns.map((column) => {
          return (
            <Button
              key={column.field}
              className={classNames(column.visible ? 'selected-option' : 'available-option' )}

              onClick={() =>
                setColumns((prev) => prev && prev.map((pc) => {
                  if (pc.field === column.field) {
                    return { ...pc, visible: !pc.visible };
                  }
                  return pc;
                }))
              }
            >
              {column.label}
            </Button>
          );
        })}
      </div>

      <Separator></Separator>
    </>

  ), [columns]);

  return (
    <div className='my-content'>
      <SuperTable
        columns={columns}
        values={values}

        subOptions={subOptions}

        tableTitle='Users total'
        tableDesc='Stats about where and how users connects'
        indexColumn={true}
        options={[10, 25, 50, 100]}
        // reloadFunction={() => { setValues([]); }}
      />
    </div>
  );
}
