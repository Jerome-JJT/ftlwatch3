import classNames from 'classnames';
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Datatable,
  initTE
} from 'tw-elements';
import { type UseLoginDto } from '../Hooks/useLogin';
import axios from 'axios';
import { AxiosErrorText } from '../Hooks/AxiosErrorText';

interface TableauProps {
  loginer: UseLoginDto
}

class ColumnProps {
  label: string = ''
  field: string = ''
  sortable?: boolean = true
}

class PoolFilterProps {
  id: string = ''
  name: string = ''
  hidden: boolean = true
}

function compareDates(a: string, b: string): number {
  const [yearA, monthA] = a.split('.');
  const [yearB, monthB] = b.split('.');

  if (a === 'None.None') {
    return 1;
  } else if (b === 'None.None') {
      return -1;
  }

  if (yearA !== yearB) {
      return parseInt(yearA) - parseInt(yearB);
  }

  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  return months.indexOf(monthA) - months.indexOf(monthB);
}

export default function NavBar ({
  loginer
}: TableauProps): JSX.Element {
  const datatable = React.useRef<HTMLDivElement | null>(null);

  const [searchParams] = useSearchParams();
  const defaultFilter = searchParams.get("filter");

  console.log('default', defaultFilter)

  const [usedFilter, setUsedFilter] = React.useState<string | undefined>(defaultFilter !== null ? defaultFilter : undefined);
  const [filters, setFilters] = React.useState<PoolFilterProps[] | undefined>(undefined);
  // const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);

  React.useEffect(() => {
      axios
        .get('/?page=poolfilters&action=get',
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {

            (res.data as PoolFilterProps[]).sort((a, b) => compareDates(a.name, b.name));
          
            setFilters(res.data);
          }
        })
        .catch((error) => {
          return AxiosErrorText(error);
        });
  }, [])

  React.useEffect(() => {
  }, [])
  
  React.useEffect(() => {
    console.log(datatable.current)
    if (datatable.current) {
      datatable.current.innerHTML = '';
      initTE({ Datatable });

      axios
        .get(`/?page=tableau${usedFilter ? `&filter=${usedFilter}` : ''}`,
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {
            // if (columns === undefined) {
            //   setColumns(res.data.columns);
            // }

            const cols = res.data.columns as ColumnProps[];

            const asyncTable = new Datatable(
              datatable.current,
              {cols},
              { loading: true }
            );
            asyncTable.update(
              {
                rows: res.data.values.map((row: any) => ({
                  ...row,
                  avatar_url: `<img style='width: 120px; object-fit: none;' src='${row.avatar_url}'/>`
                }))
              },
              { loading: false }
            );
          }
        })
        .catch((error) => {
          // setLogged(false);
          // setUserInfos({} as LoggedUserDto);
          return AxiosErrorText(error);
        });
    }
  }, [datatable.current, usedFilter])

  //
  return (
    <div className='mx-8 mt-2'>
      <div className='mb-2'>
        {
          filters?.map((filter) => {
            return (
            <button
              key={filter.id}
              type="button"
              className="inline-block rounded-full bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
              onClick={() => setUsedFilter(filter.name)}
              >
              {filter.hidden ? '$' : ''}{filter.name}
            </button>
            )
          })
        }
      </div>
      <div ref={datatable}></div>
    </div>
  );
}
