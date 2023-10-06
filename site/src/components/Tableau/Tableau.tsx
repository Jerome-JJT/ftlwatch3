import React from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Checkbox,
} from '@material-tailwind/react';
import { SuperTable } from 'Common/SuperTable';
import { useNotification } from 'Notifications/NotificationsProvider';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

class ColumnProps {
  field: string = '';
  label: string = '';
}

class PoolFilterProps {
  id: string = '';
  name: string = '';
  hidden: boolean = true;
}

const StyledTableau = styled.div`
  tbody tr td {
    height: 100px;
    min-height: 100px;
    max-height: 100px;
    padding: 4px;
  }
`;

export function TableauPage(): JSX.Element {
  const { addNotif } = useNotification();
  const [searchParams] = useSearchParams();
  const defaultFilter = searchParams.get('filter');

  // const [pageError, setPageError] = React.useState<string | undefined>(undefined);

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  const [usedFilter, setUsedFilter] = React.useState<string | undefined>(defaultFilter !== null ? defaultFilter : 'cursus');
  const [filters, setFilters] = React.useState<PoolFilterProps[] | undefined>(undefined);

  // const changePermission = async (userId: number, groupId: number, value: boolean): Promise<boolean> => {
  //   return await axios
  //     .post('/?page=permissions&action=perm_set',
  //       `groupId=${userId}&permId=${groupId}&value=${value}`, { withCredentials: true }
  //     )
  //     .then((res) => {
  //       if (res.status === 200) {
  //         // localStorage.setItem('token', res.data.access_token);
  //       } //
  //       return true;
  //     })
  //     .catch((error) => {
  //       addNotif(AxiosErrorText(error), 'error')
  //       return false;
  //     });
  // }

  React.useEffect(() => {
    axios
      .get(`/?page=tableau&action=get${usedFilter ? `&filter=${usedFilter}` : ''}`,
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          if (res.data.values.length > 0) {
            setColumns(res.data.columns as ColumnProps[]);

            const displayValues = res.data.values.map((user: any) => {
              res.data.columns.forEach((col: ColumnProps) => {
                if (col.field === 'login') {
                  user[col.field] = <a
                    href={`https://profile.intra.42.fr/users/${user.login}`}
                  >{user.login}</a>;
                }
                else if (col.field === 'avatar_url') {
                  user[col.field] = <img
                    src={user[col.field]}
                    alt={user.login}
                    className='max-w-full max-h-full max-w-[60px] rounded-lg'
                  />;
                }
              });

              return user;
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
  }, [addNotif, usedFilter]);

  //
  return (
    <div className='mx-8 mt-2'>
      {(columns && values) &&
        <StyledTableau>

          <SuperTable
            columns={columns}
            values={values}
            tableTitle='Tableau'
            options={[10, 25, 50, 100]}
            reloadFunction={() => { setValues([]); }}
          />
        </StyledTableau>
      }
    </div>
  );
}
