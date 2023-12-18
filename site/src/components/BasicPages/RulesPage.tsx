import React from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import { SuperTable } from 'Common/SuperTable';
import { useNotification } from 'Notifications/NotificationsProvider';
import { ColumnProps } from 'Utils/columnsProps';
import { commonTitle } from 'Utils/commonTitle';


export function RulesPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Rules page');}, []);

  React.useEffect(() => {
    axios
      .get('/?page=basic&action=get_rules',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setColumns(res.data.columns as ColumnProps[]);

          const displayValues = res.data.values.map((user: any) => {
            // res.data.columns.forEach((col: ColumnProps) => {
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
            // });

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


          tableTitle='Rules'
          tableDesc={'Project\'s rules'}
          options={[100]}
          // reloadFunction={() => { setValues([]); }}
        />
      }
    </div>
  );
}
