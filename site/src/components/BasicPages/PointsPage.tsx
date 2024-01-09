import React from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import { SuperTable } from 'Common/SuperTable';
import { useNotification } from 'Notifications/NotificationsProvider';
import { ColumnProps } from 'Utils/columnsProps';
import { commonTitle } from 'Utils/commonTitle';



export function PointsPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Points page');}, []);


  React.useEffect(() => {
    axios
      .get('/?page=basic&action=get_points',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setColumns(res.data.columns as ColumnProps[]);

          const displayValues = res.data.values.map((user: any) => {
            res.data.columns.forEach((col: ColumnProps) => {

              if (col.field === 'login') {
                user[`_${col.field}`] = user[col.field];
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


  return (
    <div className='my-content'>
      {(columns && values) &&
        <SuperTable
          columns={columns}
          values={values}
          indexColumn={true}

          tableTitle='Points'
          tableDesc='Stats about points given to pool and evaluations'
          options={[25, 50, 100]}
          // reloadFunction={() => { setValues([]); }}
        />
      }
    </div>
  );
}
