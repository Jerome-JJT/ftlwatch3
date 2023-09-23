import classNames from 'classnames';
import React, { useMemo } from 'react';
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
  Checkbox,
  Select,
  Option,
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

export function GroupsPage({
  loginer
}: GroupsProps): JSX.Element {

  const [searchParams] = useSearchParams();
  const defaultFilter = searchParams.get('filter');

  const [pageError, setPageError] = React.useState<string | undefined>(undefined);


  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [usersPerPage, setUsersPerPage] = React.useState(10);

  const [sortColumn, setSortColumn] = React.useState('id');
  const [sortDirection, setSortDirection] = React.useState('asc');


  const handleUsersPerPageChange = (value: any) => {
    setUsersPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleSort = (column: any) => {
    if (sortColumn === column) {
      // Toggle the sorting direction if the same column is clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set a new sorting column
      setSortColumn(column);
      setSortDirection('asc'); // Reset sorting direction to ascending
    }
  };

  const customSort = (a: any, b: any) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
  
    if (typeof aValue !== 'undefined' && typeof bValue !== 'undefined') {
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        // If both values are numbers, compare them numerically
        return aValue - bValue;
      } else {
        // If either value is not a number, compare them as strings
        return aValue.toString().localeCompare(bValue.toString());
      }
    }
    else {
      // If the sortColumn doesn't exist in one of the objects, maintain the order
      return 0;
    }
  };

  const totalPages = useMemo(() => Math.ceil((values?.length || 0) / usersPerPage), [values, usersPerPage]);
  const pageNumbers: number[] = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const startIndex = useMemo(() => (currentPage - 1) * usersPerPage, [currentPage, usersPerPage]);
  const endIndex = useMemo(() => startIndex + usersPerPage, [startIndex, usersPerPage]);

  const displayedUsers = useMemo(() => values?.slice(startIndex, endIndex) || [], [values, startIndex, endIndex]);

  const sortedValues = useMemo(() => [...values || []].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
  
    if (sortDirection === 'asc') {
      return customSort(aValue, bValue);
    } else {
      return customSort(bValue, aValue);
    }
  }), [values, sortColumn]);


  React.useEffect(() => {

    axios
      .get(`/?page=permissions&action=groups_get`,
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {

          if (res.data.values.length > 0) {
            setColumns(res.data.columns as ColumnProps[]);


            const displayValues = Object.values(res.data.values).map((user_groups: any) => {

              console.log(user_groups)
              // return user_groups

              Object.keys(user_groups).forEach((key) => {
                if (key !== 'id' && key !== 'login') {
                  user_groups[key] = <Checkbox defaultChecked={user_groups[key]}></Checkbox>
                }
              })

              return user_groups
            })
            console.log(displayValues)

            setValues(displayValues as any[]);

            setPageError(undefined);
          }
          else {
            setPageError('No results found');
          }
        }
      })
      .catch((error) => {
        // setLogged(false);
        // setUserInfos({} as LoggedUserDto);
        return AxiosErrorText(error);
      });
  }, [])




  //
  return (
    <div className='mx-8 mt-2'>

      {pageError !== undefined && (
        <>
          <Toasty addClass='bg-danger-100 text-danger-700' icon={<AiFillExclamationCircle size='20px' />}>
            {pageError}
          </Toasty>
        </>
      )}

      {(columns && values) &&
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none overflow-visible">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Members list
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all members
                </Typography>
              </div>

            </div>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="w-full md:w-72">
                <Select onChange={handleUsersPerPageChange} value={usersPerPage.toString()} variant="standard" label="Select Version">
                  <Option value='1'>1</Option>
                  <Option value='2'>2</Option>
                  <Option value='50'>50</Option>
                  <Option value='100'>100</Option>
                  {/* <Option value=`${values.length}`>All</Option> */}
                </Select>
              </div>
              <div className="w-full md:w-72">
                <Input
                  label="Search"
                />
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-scroll px-0">
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr className="even:bg-blue-gray-50/50">
                  {columns.map((value, index) => (
                    <th
                      key={value.field}
                      onClick={() => handleSort(value.field)}
                      className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        {value.label?.toString()}{" "}{sortColumn === value.field ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((value, index) => {
                  const isLast = index === values.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={index}>
                      {columns.map((col) =>

                        <td key={col.field} className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              {/* <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              > */}
                                {value[col.field]}
                              {/* </Typography> */}
                            </div>
                          </div>
                        </td>

                      )}
                    </tr>
                  );
                },
                )}
              </tbody>
            </table>
          </CardBody>
          <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">

              {pageNumbers.map((pageNumber) => (
                <IconButton
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "outlined" : "text"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </IconButton>
              ))}
            </div>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
               Next
            </Button>
          </CardFooter>
        </Card>
      }
    </div>
  );
}
