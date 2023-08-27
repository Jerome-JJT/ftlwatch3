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
  initTE({ Datatable });

  const datatable = React.useRef<HTMLDivElement | null>(null);
  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);

  React.useEffect(() => {
    if (datatable.current) {
      const asyncTable = new Datatable(
        datatable.current,
        { columns },
        { loading: true }
      );

      axios
        .get('/?page=tableau',
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {
            if (columns === undefined) {
              setColumns(res.data.columns);
            }

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
  }, [columns])

  //
  return (
    <div ref={datatable}></div>
  );
}
