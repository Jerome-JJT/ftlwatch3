import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
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

export default function NavBar ({
  loginer
}: TableauProps): JSX.Element {
  const datatable = React.useRef<HTMLDivElement | null>(null);

  const [filters, setFilters] = React.useState<ColumnProps[] | undefined>(undefined);
  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);

  React.useEffect(() => {
    if (datatable.current) {
      datatable.current.innerHTML = '';
      initTE({ Datatable });

      axios
        .get('/?page=tableau',
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {
            if (columns === undefined) {
              setColumns(res.data.columns);
            }

            const asyncTable = new Datatable(
              datatable.current,
              { columns },
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
  }, [])

  //
  return (
    <div className='mx-8 mt-2'>
      <div className='mb-2'>
      <button
        type="button"
        className="inline-block rounded-full bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
        Primary
      </button>
      </div>
      <div ref={datatable}></div>
    </div>
  );
}
