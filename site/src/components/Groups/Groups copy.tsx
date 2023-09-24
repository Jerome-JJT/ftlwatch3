import classNames from 'classnames';
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
// import {
//   Datatable,
//   initTE
// } from 'tw-elements';
import { type UseLoginDto } from '../Hooks/useLogin';
import axios from 'axios';
import { AxiosErrorText } from '../Hooks/AxiosErrorText';
import Separator from '../Common/Separator';
import Toasty from '../Common/Toasty';
import { AiFillExclamationCircle } from 'react-icons/ai';
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";


interface GroupsProps {
  loginer: UseLoginDto
}

class ColumnProps {
  field: string = ''
  label: string = ''
}

// class PoolFilterProps {
//   id: string = ''
//   name: string = ''
//   hidden: boolean = true
// }

export function GroupsPage ({
  loginer
}: GroupsProps): JSX.Element {
  const datatable = React.useRef<HTMLDivElement | null>(null);
  const datatableSearch = React.useRef<HTMLInputElement | null>(null);

  const [searchParams] = useSearchParams();
  const defaultFilter = searchParams.get('filter');

  console.log('default', defaultFilter)

  const [usedFilter, setUsedFilter] = React.useState<string | undefined>(defaultFilter !== null ? defaultFilter : 'cursus');
  // const [filters, setFilters] = React.useState<PoolFilterProps[] | undefined>(undefined);
  const [pageError, setPageError] = React.useState<string | undefined >(undefined);

  // React.useEffect(() => {
  //   axios
  //     .get('/?page=poolfilters&action=get',
  //       { withCredentials: true }
  //     )
  //     .then((res) => {
  //       if (res.status === 200) {
  //         (res.data as PoolFilterProps[]).sort((a, b) => compareDates(a.name, b.name));

  //         setFilters(res.data);
  //       }
  //     })
  //     .catch((error) => {
  //       return AxiosErrorText(error);
  //     });
  // }, [])


  const aaa = async () => {
    const res = await axios
        .get(`/?page=permissions&action=groups_get`,
          { withCredentials: true }
        )
        .then((res) => res)
        .catch((error) => {
          // setLogged(false);
          // setUserInfos({} as LoggedUserDto);
          return AxiosErrorText(error);
        });


        if (res.status === 200) {
          const tmp_cols = res.data.columns as ColumnProps[];
          const cols = tmp_cols.map((v) => ({...v, field: v.field.toString()}))

          console.log('aaaa', res.data.values);
          
          const asyncTable = new Datatable(
            datatable.current,
            { columns: Object.values(cols) },
            { loading: true }
          );

          // console.log('aaaa', res.data.values);

          const displayValues = Object.values(res.data.values).map((user_groups: any) => {

            console.log(user_groups)
            // return user_groups

            Object.keys(user_groups).forEach((key) => {
              if (key !== 'id' && key !== 'login') {
                user_groups[key] = `<input type='checkbox' onClick=checkboxClick ${user_groups[key] ? 'checked' : ''}>`
              }
            })

            return user_groups
          })

          // console.log('bbbb');
          // console.log('bbbb', displayValues);
          // if (datatableSearch.current !== null) {
          //   datatableSearch.current.addEventListener('input', (e: any) => {
          //     asyncTable.search(e.target.value);
          //   });
          // }

          if (res.data.values.length > 0) {
            asyncTable.update(
              {
                rows: displayValues.map((row: any) => ({
                  ...row,
                }))
              },
              { loading: false }
            );
            setPageError(undefined);
          }
          else {
            setPageError('No results found');
          }
        }
      }
  


  React.useEffect(() => {
    console.log(datatable.current)

    if (datatable.current) {
      datatable.current.innerHTML = '';
      initTE({ Datatable });

      aaa();
      
    }
  }, [usedFilter])

  const checkboxClick = () => {
    alert('test')
  }

  //
  return (
    <div className='mx-8 mt-2'>
      <script>
        
      </script>
      {/* <div className='mb-2 flex flex-wrap justify-around gap-1'>
        {
          filters?.map((filter) => {
            return (
            <button
              key={filter.id}
              type="button"
              className="inline-block rounded-full bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
              onClick={() => { setUsedFilter(filter.name); }}
              >
              {filter.hidden ? '$' : ''}{filter.name}
            </button>
            )
          })
        }
      </div>
      <Separator /> */}
      <div className='flex justify-center items-center text-lg font-medium tracking-wide'>
        Currently selected : { usedFilter }
      </div>
      <Separator />
      { pageError !== undefined && (
        <>
        {pageError}
        <Toasty addClass='bg-danger-100 text-danger-700' icon={<AiFillExclamationCircle size='20px'/>}>
          {pageError}
        </Toasty>
        </>
      )}

      <div className="bg-white border border-black">
        <div className="relative flex w-full flex-wrap items-stretch">
          <input
            ref={datatableSearch}
            type="search"
            className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="button-addon1" />
        </div>
      </div>

      <div ref={datatable}
        data-te-fixed-header="true"
        data-te-max-height="720"
       className={classNames(pageError !== undefined ? 'hidden' : '')}></div>
    </div>
  );
}