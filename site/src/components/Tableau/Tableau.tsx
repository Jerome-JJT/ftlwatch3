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

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  const [usedFilter, setUsedFilter] = React.useState<string | undefined>(defaultFilter !== null ? defaultFilter : 'cursus');
  const [poolFilters, setPoolFilters] = React.useState<PoolFilterProps[] | undefined>(undefined);

  React.useEffect(() => {
    axios
      .get('/?page=poolfilters&action=get_tableau',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          (res.data as PoolFilterProps[]).sort((a, b) => comparePoolfilters(a.name, b.name));

          setPoolFilters(res.data);
        }
      })
      .catch((error) => {
        return AxiosErrorText(error);
      });
  }, []);

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
                    className='max-h-full max-w-[60px] rounded-lg'
                  />;
                }
              });

              return user;
            });
            setValues(displayValues);
          }
          else {
            // addNotif('No results found', 'error');
          }
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif, usedFilter]);

  const subOptions = useMemo(() => (
    <>
      <div className='flex flex-wrap gap-2 justify-evenly'>

        {poolFilters && poolFilters.map((filter) => {
          return (
            <Button
              key={filter.id}
              className={classNames(filter.name === usedFilter ? 'bg-blue-900' : (filter.hidden ? 'bg-blue-200' : 'bg-blue-700' ))}
              //  className="inline-block rounded-full bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
              onClick={() => { setUsedFilter((prev) => prev !== filter.name ? filter.name : undefined); } }
            >
              {filter.name}
            </Button>
          );
        })}
      </div>
      <Separator></Separator>
    </>

  ), [poolFilters, usedFilter]);

  //
  return (
    <div className='mx-8 mt-2'>
      {(columns && values) &&
        <StyledTableau>

          <SuperTable
            columns={columns}
            values={values}

            subOptions={subOptions}

            tableTitle='Tableau'
            options={[10, 25, 50, 100]}
            reloadFunction={() => { setValues([]); }}
          />
        </StyledTableau>
      }
    </div>
  );
}
