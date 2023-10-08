import React, { ReactNode, useMemo } from 'react';
import { AiOutlineSync } from 'react-icons/ai';
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

class ImageProps {
  values: any[] = [];

  subOptions?: ReactNode | undefined;

  tableTitle?: string | undefined;
  tableDesc?: string | undefined;

  options?: number[];
  hasOptionAll?: boolean;
  reloadFunction?: (() => void) | undefined;
}

export function SuperImage({
  values,

  subOptions = undefined,

  tableTitle = undefined,
  tableDesc = undefined,

  options = [10, 30, 50, 100],
  hasOptionAll = true,

  reloadFunction = undefined,
}: ImageProps): JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [doIncludeAll, setDoIncludeAll] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [usersPerPage, setUsersPerPage] = React.useState(options[0]);
  // const [usersPerPage, setUsersPerPage] = React.useState(values.length);

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

  const filteredUsers = useMemo(() => values.filter((user) => {
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
  }), [values, searchQuery, doIncludeAll]);


  const totalPages = useMemo(() => Math.ceil((filteredUsers?.length || 0) / usersPerPage), [filteredUsers, usersPerPage]);
  const pageNumbers = useMemo(() => generatePageNumbers(currentPage, totalPages, 5), [currentPage, totalPages]);

  const startIndex = useMemo(() => (currentPage - 1) * usersPerPage, [currentPage, usersPerPage]);
  const endIndex = useMemo(() => startIndex + usersPerPage, [startIndex, usersPerPage]);

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

        {subOptions &&
         <Accordion open={isSubmenuOpen} className=''>
           <AccordionHeader className='py-2' onClick={() => setIsSubmenuOpen((prev) => !prev)}>Sub options</AccordionHeader>

           <AccordionBody>

             {subOptions}
           </AccordionBody>
         </Accordion>
        }
      </CardHeader>

      <CardBody className='flex gap-2 flex-wrap justify-center'>

        { displayedUsers.map((user) =>

          <Card key={user.id} className="flex min-w-48 w-48 max-w-48 h-80 border-black border-2">
            <CardHeader floated={false} className='flex h-48 min-h-48 justify-center shadow-none mx-2 mt-2'>
              <img className='max-h-full rounded-lg object-contain' src={user.avatar_url} alt="profile-picture" />
            </CardHeader>

            <CardBody className="flex grow justify-evenly flex-col text-center align-center p-2">

              <div>
                <p color="blue-gray" className="mb-1">
                  {user.first_name} {user.last_name}
                </p>
              </div>

              <div>
                <p color="blue-gray" className="mb-1">
                  {user.poolfilter}
                </p>
              </div>
            </CardBody>

            <CardFooter className="pt-0 flex justify-center pb-4">
              <a href={`https://profile.intra.42.fr/users/${user.login}`}><Button>{user.login}</Button></a>
            </CardFooter>
          </Card>
        )}

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
