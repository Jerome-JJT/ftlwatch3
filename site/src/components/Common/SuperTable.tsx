import React, { ReactNode, useCallback, useMemo } from 'react';
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
  Switch,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from '@material-tailwind/react';
import MySelect from './MySelect';
import classNames from 'classnames';
import { ColumnProps } from 'Utils/columnsProps';
import MyInput from './MyInput';
import { createKey } from 'Utils/createKey';


interface SuperTableProps {
  columns: ColumnProps[];
  values: any[];

  subOptions?: ReactNode | undefined;

  tableTitle?: string | undefined;
  tableDesc?: string | undefined;

  options?: number[];
  hasOptionAll?: boolean;
  reloadFunction?: (() => void) | undefined;
}

export function SuperTable({
  columns,
  values,

  subOptions = undefined,

  tableTitle = undefined,
  tableDesc = undefined,

  options = [10, 30, 50, 100],
  hasOptionAll = true,

  reloadFunction = undefined,
}: SuperTableProps): JSX.Element {

  const [searchQuery, setSearchQuery] = React.useState('');
  const [doIncludeAll, setDoIncludeAll] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [usersPerPage, setUsersPerPage] = React.useState(options[0]);

  const [sortColumn, setSortColumn] = React.useState('id');
  const [sortDirection, setSortDirection] = React.useState('asc');

  const [isSubmenuOpen, setIsSubmenuOpen] = React.useState(false);

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

  const customSort = useCallback((a: any, b: any): number => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue !== 'undefined' && typeof bValue !== 'undefined') {
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return aValue - bValue;
      }
      else if (aValue !== null && bValue === null) {
        return -1;
      }
      else if (bValue !== null && aValue === null) {
        return 1;
      }
      else if (aValue === null && bValue === null) {
        return 0;
      }
      else {
        return aValue.toString().localeCompare(bValue.toString());
      }
    }
    else {
      return 0;
    }
  }, [sortColumn]);

  const generatePageNumbers = (currentPage: number, totalPages: number, maxPages: number): number[] => {
    const halfMaxPages = Math.floor(maxPages / 2);
    const startPage = Math.max(currentPage - halfMaxPages, 1);
    const endPage = Math.min(currentPage + halfMaxPages, totalPages);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };


  const sortedValues = useMemo(() => [...values || []].sort((a, b): number => {
    if (sortDirection === 'asc') {
      return customSort(a, b);
    }
    else {
      return customSort(b, a);
    }
  }), [values, sortDirection, customSort]);

  const filteredUsers = useMemo(() => sortedValues.filter((user) => {
    const userValues = Object.values(user);
    const searchTerms = searchQuery.split(',');

    if (doIncludeAll) {
      return searchTerms.every((term) => {
        return userValues.some((value: any) => {
          return typeof value !== 'object' &&
          value.toString().toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(
            term.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          );
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
          );
        }
        );
      });
    }
  }), [sortedValues, searchQuery, doIncludeAll]);

  const totalPages = useMemo(() => {
    const tot = Math.ceil((filteredUsers?.length || 0) / usersPerPage);
    if (currentPage > tot) {
      setCurrentPage(1);
    }
    return tot;
  }, [currentPage, filteredUsers?.length, usersPerPage]);

  const pageNumbers = useMemo(() => generatePageNumbers(currentPage, totalPages, 5), [currentPage, totalPages]);

  const startIndex = useMemo(() => (currentPage - 1) * usersPerPage, [currentPage, usersPerPage]);
  const endIndex = useMemo(() => startIndex + usersPerPage, [startIndex, usersPerPage]);

  const displayedUsers = useMemo(() => filteredUsers?.slice(startIndex, endIndex) || [], [filteredUsers, startIndex, endIndex]);

  return (
    <Card className="big-card super-big-card">
      <CardHeader floated={false} shadow={false} className="super-big-header">
        <div className="super-big-header-content">
          <div>
            {tableTitle &&
              <p className="super-title">
                {tableTitle}
              </p>
            }
            {tableDesc &&
              <p className="super-description">
                {tableDesc}
              </p>
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

        <div className="super-settings-bar">
          {options.length > 0 &&
            <div>
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

          <div>
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
            <MyInput
              label="Search"
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {subOptions &&
          <Accordion open={isSubmenuOpen} className=''>
            <AccordionHeader className='py-2 my-text' onClick={() => setIsSubmenuOpen((prev) => !prev)}>Sub options</AccordionHeader>

            <AccordionBody>

              {subOptions}
            </AccordionBody>
          </Accordion>
        }
      </CardHeader>

      <CardBody>
        <div className="mt-4 overflow-auto border-black border-2 h-800 resize-y">
          <table className="w-full min-w-max table-auto text-left">
            <thead className='sticky top-0'>
              <tr className="bg-blue-gray-50">
                {columns.map((value) => value.visible !== false && (
                  <th
                    key={value.field}
                    onClick={() => { handleSort(value.field); }}
                    className="cursor-pointer border-b border-blue-gray-100 dark:bg-blue-gray-500 p-4 max-w-4 transition-colors hover:bg-blue-gray-200"
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
              {displayedUsers.length > 0 && displayedUsers.map((value, index) => {
                const isLast = index === values.length - 1;
                const classes = isLast
                  ? 'p-4'
                  : 'p-4';

                return (
                  <tr key={createKey(value, index)}
                    className='border-b border-gray-300
                    odd:bg-white even:bg-blue-50  hover:bg-blue-gray-100
                    dark:odd:bg-gray-400 dark:even:bg-blue-gray-200 dark:hover:bg-blue-gray-300'>
                    {columns.map((col) => col.visible !== false && (

                      <td key={`${createKey(value, index)}-${col.field}`}
                        className={classNames('border-x border-blue-gray-50 overflow-hidden p-4 max-w-4 table-cell', classes)}>
                        <div className="h-full flex justify-center items-center">
                          {
                            value[col.field] === undefined ? 'undefined' : (
                              value[col.field] === null ? 'null' : (
                                typeof value[col.field] === 'object' ?
                                  value[col.field] :
                                  value[col.field].toString()
                              )
                            )
                          }
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              }) ||
              <tr>
                <td className='text-6xl text-blue-500 font-bold text-center' colSpan={columns.length}>
                  <br/>0 results<br/><br/>
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </CardBody>

      <CardFooter className="super-big-footer">
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
                onClick={() => { setCurrentPage(1); }}
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
                onClick={() => { setCurrentPage(totalPages); }}
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
  );
}
