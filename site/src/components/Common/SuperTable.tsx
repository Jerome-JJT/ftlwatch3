import React, { ReactNode, useCallback, useMemo } from 'react';
import { AiOutlineCaretDown, AiOutlineCaretLeft, AiOutlineCaretUp, AiOutlineSync, AiOutlineLink } from 'react-icons/ai';
import {
  Card,
  CardHeader,
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
import { Spinner } from '@material-tailwind/react';
import { useSearchParams } from 'react-router-dom';
import { objUrlEncode } from 'Utils/objUrlEncode';
import { useNotification } from 'Notifications/NotificationsProvider';


interface SuperTableProps {
  columns: ColumnProps[] | undefined;
  values: any[] | undefined;

  subOptions?: ReactNode | undefined;
  defaultSearch?: string | undefined;

  tableTitle?: string | undefined;
  tableDesc?: string | undefined;

  options?: number[];
  indexColumn?: boolean;
  hasOptionAll?: boolean;
  reloadFunction?: (() => void) | undefined;
  hasLink?: boolean | undefined;
}

export function SuperTable({
  columns,
  values,

  subOptions = undefined,
  defaultSearch = '',

  tableTitle = undefined,
  tableDesc = undefined,

  options = [10, 30, 50, 100],
  indexColumn = false,
  hasOptionAll = true,

  reloadFunction = undefined,
  hasLink = true,
}: SuperTableProps): JSX.Element {

  const { addNotif } = useNotification();
  const [searchParams] = useSearchParams();
  const defaultSearchURL = searchParams.get('search');
  const defaultIncludeAll = searchParams.get('searchIncludeAll');

  const [searchQuery, setSearchQuery] = React.useState(defaultSearchURL !== null ? defaultSearchURL : defaultSearch);
  const [doIncludeAll, setDoIncludeAll] = React.useState(defaultIncludeAll === 'true');

  const [currentPage, setCurrentPage] = React.useState(1);
  const [usersPerPage, setUsersPerPage] = React.useState(options[options.length - 1]);

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
    let aValue = a[`_${sortColumn}`] !== undefined ? a[`_${sortColumn}`] : a[sortColumn];
    let bValue = b[`_${sortColumn}`] !== undefined ? b[`_${sortColumn}`] : b[sortColumn];

    if (typeof aValue !== 'undefined' || typeof bValue !== 'undefined') {

      if (typeof aValue === 'undefined' || aValue === null) {
        aValue = '';
      }
      if (typeof bValue === 'undefined' || bValue === null) {
        bValue = '';
      }

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


  const sortedValues = useMemo(() => values && [...values]?.sort((a, b): number => {
    if (sortDirection === 'asc') {
      return customSort(a, b);
    }
    else {
      return customSort(b, a);
    }
  }) || undefined, [values, sortDirection, customSort]);

  const filteredUsers = useMemo(() => sortedValues?.filter((user) => {
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

  const displayedUsers = useMemo(() => filteredUsers?.slice(startIndex, endIndex), [filteredUsers, startIndex, endIndex]);

  const headerClasses = 'w-10 md:w-24 md:max-w-24 border-b border-blue-gray-100 dark:bg-blue-gray-500 pl-1 pr-2 md:px-3 py-4 max-w-4 transition-colors';
  const headerPClasses = 'grow items-center gap-2 font-normal leading-none opacity-70 truncate text-black';

  return (
    <Card className="big-card super-big-card !text-xs md:!text-base">
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

          {hasLink &&
            <IconButton
              title='Copy to clipboard'
              onClick={async () => {
                const base = `${window.location.origin}${window.location.pathname}`;

                const args = objUrlEncode({
                  ...Object.fromEntries(searchParams.entries()),
                  "search": searchQuery,
                  "searchIncludeAll": doIncludeAll ? true : undefined
                });

                const link = `${base}?${args}`;
                window.history.replaceState(null, '', link);
                
                try {
                  await navigator.clipboard.writeText(link);
                  addNotif("Copied to clipboard", "INFO");
                } catch (error) {
                  addNotif("Unable to copy to clipboard", "ERROR");
                }
              }}
              variant='outlined'
            >
              <AiOutlineLink size={24} />
            </IconButton>
          }
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
                {hasOptionAll && <option key='all' value={`${values?.length || 0}`}>All</option>}
              </MySelect>
            </div>
          }

          <p>{/*filtered beacause count all pages */filteredUsers?.length || 0} {(filteredUsers?.length || 0) > 1 ? 'items' : 'item'}</p>


          <div>
            <Switch crossOrigin={undefined}
              className='bg-black'
              color='red'
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
              defaultValue={searchQuery}
            />
          </div>
        </div>

        {subOptions &&
          <Accordion open={isSubmenuOpen}>
            <AccordionHeader className='py-2 my-text bg-black/20' onClick={() => setIsSubmenuOpen((prev) => !prev)}>Sub options</AccordionHeader>

            <AccordionBody>
              {subOptions}
            </AccordionBody>
          </Accordion>
        }
      </CardHeader>

      <CardBody className='super-big-body'>
        <div className="mt-4 overflow-auto border-black border-2 h-[800px] resize-y">
          {columns && displayedUsers && (
            <table className="w-full min-w-max table-auto text-left">
              <thead className='sticky top-0 z-10'>
                <tr className="bg-blue-gray-50">
                  { indexColumn &&
                  <th
                    key='index'
                    className={classNames(headerClasses)}
                  >
                    <div className='flex flex-row justify-center text-sm h-4 text-black'>
                      <p className={headerPClasses}>
                      Index
                      </p>
                    </div>

                  </th>
                  }
                  {columns.map((value) => value.visible !== false && (
                    <th
                      key={value.field}
                      onClick={() => { handleSort(value.field); }}
                      className={classNames('cursor-pointer hover:bg-blue-gray-200', headerClasses)}
                      title={value.label.toString()}
                    >
                      <div className='flex flex-row justify-center text-sm h-4 gap-x-2 text-black'>
                        <p className={headerPClasses}>
                          {value.label.toString()}
                        </p>
                        {sortColumn === value.field
                          ? (sortDirection === 'asc'
                            ? <AiOutlineCaretUp/>
                            : <AiOutlineCaretDown/>)
                          : <AiOutlineCaretLeft />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedUsers.length > 0 && displayedUsers.map((value, index) => {
                // const isLast = index === values.length - 1;

                  return (
                    <tr key={createKey(value, index)}
                      className='border-b border-gray-300
                      odd:bg-white even:bg-blue-50 hover:bg-blue-gray-100
                      dark:odd:bg-gray-400 dark:even:bg-blue-gray-200 dark:hover:bg-blue-gray-300'
                      style={{ backgroundColor: value['_line_color'] ? `${value['_line_color']}` : undefined }}>
                      { indexColumn &&
                        <td key={`${createKey(value, index)}-index`}
                          className={classNames('border-x border-blue-gray-50 overflow-hidden p-4 max-w-4 table-cell')}>
                          <div className="h-full flex justify-center items-center text-black">
                            {(currentPage - 1) * usersPerPage + (index + 1)}
                          </div>
                        </td>
                      }

                      {columns.map((col) => col.visible !== false && (

                        <td key={`${createKey(value, index)}-${col.field}`}
                          className={classNames('border-x border-blue-gray-50 overflow-hidden max-w-4 table-cell', typeof value[col.field] !== 'object' ? 'p-4' : '' )}
                          style={{ backgroundColor: value[`_${col.field}_color`] ? `${value[`_${col.field}_color`]}` : undefined }}>
                          <div className="h-full flex justify-center items-center text-black">
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
          ) ||
            <div className="w-full h-32 flex justify-center items-center">
              <Spinner className="h-12 w-12" />
            </div>
          }
        </div>
      </CardBody>

      {values && values.length > 0 && (
        <CardFooter className="super-big-footer">
          <Button
            variant="outlined"
            size="sm"
            className='px-1 md:px-4'
            onClick={() => { setCurrentPage(currentPage - 1); }}
            disabled={currentPage === 1}
          >
          Previous
          </Button>

          <div className="flex items-center md:gap-2">

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
                    className='hidden md:block'
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
                    className='hidden md:block'

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
            className='px-1 md:px-4'
            onClick={() => { setCurrentPage(currentPage + 1); }}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
