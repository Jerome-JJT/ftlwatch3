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
import { AiFillExclamationCircle, AiOutlineSync } from 'react-icons/ai';
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
  Switch
} from '@material-tailwind/react';

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
  const [searchParams] = useSearchParams();
  const defaultFilter = searchParams.get('filter');

  const [pageError, setPageError] = React.useState<string | undefined>(undefined);

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [doIncludeAll, setDoIncludeAll] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [usersPerPage, setUsersPerPage] = React.useState(10);

  const [sortColumn, setSortColumn] = React.useState('id');
  const [sortDirection, setSortDirection] = React.useState('asc');

  const handleUsersPerPageChange = (value: any) => {
    setUsersPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleToggleIncludeAll = () => {
    setDoIncludeAll(!doIncludeAll); // Toggle the state from true to false or vice versa
  };

  const handleSearchChange = (event: any): void => {
    setSearchQuery(event.target.value);
  };

  const handleSort = (column: any): void => {
    if (sortColumn === column) {
      // Toggle the sorting direction if the same column is clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set a new sorting column
      setSortColumn(column);
      setSortDirection('asc'); // Reset sorting direction to ascending
    }
  };

  const customSort = (a: any, b: any): number => {
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

  const generatePageNumbers = (currentPage: number, totalPages: number, maxPages: number): number[] => {
    const halfMaxPages = Math.floor(maxPages / 2);
    const startPage = Math.max(currentPage - halfMaxPages, 1);
    const endPage = Math.min(currentPage + halfMaxPages, totalPages);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  }

  const totalPages = useMemo(() => Math.ceil((values?.length || 0) / usersPerPage), [values, usersPerPage]);
  const pageNumbers = generatePageNumbers(currentPage, totalPages, 5)

  const startIndex = useMemo(() => (currentPage - 1) * usersPerPage, [currentPage, usersPerPage]);
  const endIndex = useMemo(() => startIndex + usersPerPage, [startIndex, usersPerPage]);

  const sortedValues = useMemo(() => [...values || []].sort((a, b): number => {
    if (sortDirection === 'asc') {
      return customSort(a, b);
    } else {
      return customSort(b, a);
    }
  }), [values, sortColumn, sortDirection]);

  const filteredUsers = useMemo(() => sortedValues.filter((user) => {
    const userValues = Object.values(user);

    const searchTerms = searchQuery.split(',');

    if (doIncludeAll) {
      return searchTerms.every((term) => {
        return userValues.some((value: any) => {
          return typeof value !== 'object' &&
          value.toString().toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(
            term.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          )
        }
        );
      });
    }
    else {
      return searchTerms.some((term) => {
        return userValues.some((value: any) => {
          return typeof value !== 'object' &&
          value.toString().toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(
            term.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          )
        }
        );
      });
    }
  }), [sortedValues, searchQuery, doIncludeAll]);

  const displayedUsers = useMemo(() => filteredUsers?.slice(startIndex, endIndex) || [], [filteredUsers, startIndex, endIndex]);

  React.useEffect(() => {
    axios
      .get('/?page=permissions&action=groups_get',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          if (res.data.values.length > 0) {
            setColumns(res.data.columns as ColumnProps[]);

            const displayValues = Object.values(res.data.values).map((userGroups: any) => {
              Object.keys(userGroups).forEach((key) => {
                if (key !== 'id' && key !== 'login') {
                  userGroups[key] = <Checkbox defaultChecked={userGroups[key]}></Checkbox>
                }
              })

              return userGroups
            })
            console.log(displayValues)

            setValues(displayValues);

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

              <IconButton
                onClick={undefined}
                variant='outlined'
              >
                <AiOutlineSync size={24} />
              </IconButton>

            </div>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="w-full md:w-72">
                <Select onChange={handleUsersPerPageChange} value={usersPerPage.toString()} variant="standard" label="Select Version">
                  <Option value='1'>1</Option>
                  <Option value='2'>2</Option>
                  <Option value='50'>50</Option>
                  <Option value='100'>100</Option>
                  <Option value={`${values.length}`}>All</Option>
                </Select>
              </div>

              <div className="flex w-full md:w-72 gap-2">
                  <Switch
                    checked={doIncludeAll}
                    onChange={handleToggleIncludeAll}
                    label={
                      <div>
                        <Typography color="blue-gray" className="font-medium">
                          {doIncludeAll ? 'AND' : 'OR'}
                        </Typography>
                      </div>
                    }
                  />
                <Input
                  label="Search"
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-scroll px-0">
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr className="even:bg-blue-gray-50/50">
                  {columns.map((value) => (
                    <th
                      key={value.field}
                      onClick={() => { handleSort(value.field); }}
                      className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                      >
                        {value.label?.toString()}{' '}{sortColumn === value.field ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((value, index) => {
                  const isLast = index === values.length - 1;
                  const classes = isLast
                    ? 'p-4'
                    : 'p-4 border-b border-blue-gray-50';

                  return (
                    <tr key={value.id || value.login || index}>
                      {columns.map((col) =>

                        <td key={col.field} className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              {value[col.field]}
                            </div>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
          <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => { setCurrentPage(currentPage - 1); }}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">

              {!pageNumbers.includes(1) && (
                <>
                  <IconButton
                    key={1}
                    variant='text'
                    size="sm"
                    onClick={() => { setCurrentPage(1) }}
                  >
                    1
                  </IconButton>
                  {!pageNumbers.includes(2) && (
                    <IconButton
                      key='p2'
                      variant='text'
                      size="sm"
                    >
                      ...
                    </IconButton>
                  )}
                </>
              )}

              {pageNumbers.map((pageNumber) => (
                <IconButton
                  key={pageNumber}
                  variant={pageNumber === currentPage ? 'outlined' : 'text'}
                  size="sm"
                  onClick={() => { setCurrentPage(pageNumber); }}
                >
                  {pageNumber}
                </IconButton>
              ))}

              {!pageNumbers.includes(totalPages) && (
                <>
                  {!pageNumbers.includes(totalPages - 1) && (
                    <IconButton
                      key='p3'
                      variant='text'
                      size="sm"
                    >
                      ...
                    </IconButton>
                  )}
                  <IconButton
                    key={totalPages}
                    variant='text'
                    size="sm"
                    onClick={() => { setCurrentPage(totalPages) }}
                  >
                    {totalPages}
                  </IconButton>
                </>
              )}
            </div>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => { setCurrentPage(currentPage + 1); }}
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