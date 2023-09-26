import React from 'react';
import { type UseLoginDto } from '../Hooks/useLogin';
import axios from 'axios';
import { AxiosErrorText } from '../Hooks/AxiosErrorText';
import Toasty from '../Common/Toasty';
import { AiFillExclamationCircle } from 'react-icons/ai';
import {
  Checkbox
} from '@material-tailwind/react';
import { SuperTable } from '../Common/SuperTable';

interface GroupsProps {
  loginer: UseLoginDto
}

class ColumnProps {
  field: string = ''
  label: string = ''
}

export function GroupsPage ({
  loginer
}: GroupsProps): JSX.Element {
  // const [searchParams] = useSearchParams();
  // const defaultFilter = searchParams.get('filter');

  const [pageError, setPageError] = React.useState<string | undefined>(undefined);

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  const changePermission = async (userId: number, groupId: number, value: boolean): Promise<boolean> => {
    return await axios
      .post('/?page=permissions&action=group_set', 
        `userId=${userId}&groupId=${groupId}&value=${value}`, { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          // localStorage.setItem('token', res.data.access_token);
        } //
        else {
          // setPageMessage('Error contacting 42 API');
        }
        return true;
      })
      .catch((error) => {
        setPageError(AxiosErrorText(error));
        return false;
      });
  }

  React.useEffect(() => {
    axios
      .get('/?page=permissions&action=groups_get',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          if (res.data.values.length > 0) {
            setColumns(res.data.columns as ColumnProps[]);

            const displayValues = res.data.values.map((userGroups: any) => {
              Object.keys(userGroups).forEach((key) => {
                if (key !== 'id' && key !== 'login') {
                  userGroups[key] = <Checkbox
                    id={`${userGroups.id}-${key}`}
                    defaultChecked={userGroups[key]}
                    onClick={async (e: any) => { 
                      if(!(await changePermission(userGroups.id, parseInt(key), e.target.checked))) {
                        e.target.checked = !e.target.checked;
                      }
                    }}
                  />
                }
              })

              return userGroups
            })
            setValues(displayValues);
            setPageError(undefined);
          }
          else {
            setPageError('No results found');
          }
        }
      })
      .catch((error) => {
        return AxiosErrorText(error);
      });
  }, [])

  //
  return (
    <div className='mx-8 mt-2'>
      {pageError !== undefined && (
        <>
          <Toasty
            className='bg-red-100 text-danger-700 mb-2'
            icon={<AiFillExclamationCircle />}
            closeAlert={() => { setPageError(undefined); }}>

            {pageError}
          </Toasty>
        </>
      )}

      {(columns && values) &&
        <SuperTable
          columns={columns}
          values={values}
          tableTitle='Groups'
          options={[1, 2, 3]}
          reloadFunction={() => { setValues([]) }}
        />
      }
    </div>
  );
}
