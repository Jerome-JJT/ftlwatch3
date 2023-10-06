import React, { useMemo } from 'react';
import { AiOutlineCaretDown, AiOutlineCaretLeft, AiOutlineCaretUp, AiOutlineSync } from 'react-icons/ai';
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Switch
} from '@material-tailwind/react';
import MySelect from './MySelect';
import classNames from 'classnames';

class ColumnProps {
  field: string = ''
  label: string = ''
}

class SuperTableProps {
  columns: ColumnProps[] = [];
  values: any[] = [];

  tableTitle?: string | undefined;
  tableDesc?: string | undefined;

  options?: number[];
  hasOptionAll?: boolean;
  reloadFunction?: (() => void) | undefined;
}

export function SuperTable ({
  columns,
  values,

  tableTitle = undefined,
  tableDesc = undefined,

  options = [10, 30, 50, 100],
  hasOptionAll = true,

  reloadFunction = undefined
}: SuperTableProps): JSX.Element {
  // const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  // const [values, setValues] = React.useState<any[] | undefined>(undefined);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [doIncludeAll, setDoIncludeAll] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [usersPerPage, setUsersPerPage] = React.useState(options[0]);

  const [sortColumn, setSortColumn] = React.useState('id');
  const [sortDirection, setSortDirection] = React.useState('asc');

  const handleUsersPerPageChange = (value: any): void => {
    setUsersPerPage(parseInt(value.target.value));
    setCurrentPage(1);
  };

  const handleToggleIncludeAll = (): void => {
    setDoIncludeAll(!doIncludeAll);
  };

  const handleSearchChange = (event: any): void => {
    setSearchQuery(event.target.value);
  };

  const handleSort = (column: any): void => {
    if (sortColumn === column && sortDirection === 'desc') {
      setSortColumn('');
    }
    else if (sortColumn === column) {
      setSortDirection('desc');
    }
    else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const customSort = (a: any, b: any): number => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue !== 'undefined' && typeof bValue !== 'undefined') {
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      } //
      else {
        return aValue.toString().localeCompare(bValue.toString());
      }
    }
    else {
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
  const pageNumbers = useMemo(() => generatePageNumbers(currentPage, totalPages, 5), [currentPage, totalPages]);

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

  return (
    <Card className="h-full w-full mb-8">
      <CardHeader floated={false} shadow={false} className="rounded-none overflow-visible">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            {tableTitle &&
              <Typography variant="h5" color="blue-gray">
                {tableTitle}
              </Typography>
            }
            {tableDesc &&
              <Typography color="gray" className="mt-1 font-normal">
                {tableDesc}
              </Typography>
            }
          </div>

          {reloadFunction &&
            <IconButton
              onClick={reloadFunction}
              variant='outlined'
            >
              <AiOutlineSync size={24} />
            </IconButton>
          }
        </div>

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {options.length > 0 &&
            <div className="w-full md:w-72">
              <MySelect label='Items per page' value={usersPerPage.toString()} onChange={handleUsersPerPageChange}>
                {options.map((option) =>
                  <option key={option.toString()}
                    value={option.toString()}>
                    {option.toString()}
                  </option>
                )}
                {hasOptionAll && <option key='all' value={`${values.length}`}>All</option>}
              </MySelect>
            </div>
          }

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

      <CardBody>
        <div className="mt-4 overflow-scroll border-black border border-2 resize-y">
          <table className="w-full min-w-max table-auto text-left">
            <thead className='sticky top-0'>
              <tr className="bg-blue-gray-50">
                {columns.map((value) => (
                  <th
                    key={value.field}
                    onClick={() => { handleSort(value.field); }}
                    className="cursor-pointer border-y border-blue-gray-100 p-4 transition-colors hover:bg-blue-gray-200"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center text-center gap-2 font-normal leading-none opacity-70"
                    >
                      {value.label.toString()}
                      {' '}
                      {sortColumn === value.field
                        ? (sortDirection === 'asc'
                            ? <AiOutlineCaretUp/>
                            : <AiOutlineCaretDown/>)
                        : <AiOutlineCaretLeft />}
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
                  : 'p-4';

                return (
                  <tr key={value.id || value.login || index}
                    className='border-b border-blue-gray-50'>
                    {columns.map((col) =>

                      <td key={`${value.id || value.login || index}-${col.field}`}
                        className={classNames('border-x border-blue-gray-50 overflow-hidden p-4 table-cell', classes)}>
                          <div className="h-full flex justify-center items-center">
                            {value[col.field]}
                          </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
  )
}
