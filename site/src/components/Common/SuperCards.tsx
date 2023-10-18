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
import MyInput from './MyInput';

interface CardsProps {
  values: any[];
  customCard: (value: any) => JSX.Element;

  subOptions?: ReactNode | undefined;

  tableTitle?: string | undefined;
  tableDesc?: string | undefined;

  options?: number[];
  hasOptionAll?: boolean;
  reloadFunction?: (() => void) | undefined;
}

export function SuperCards({
  values,
  customCard,

  subOptions = undefined,

  tableTitle = undefined,
  tableDesc = undefined,

  options = [10, 30, 50, 100],
  hasOptionAll = true,

  reloadFunction = undefined,
}: CardsProps): JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [doIncludeAll, setDoIncludeAll] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [cardsPerPage, setCardsPerPage] = React.useState(options[0]);
  // const [cardsPerPage, setCardsPerPage] = React.useState(values.length);

  const [isSubmenuOpen, setIsSubmenuOpen] = React.useState(false);

  const handleCardsPerPageChange = (value: any): void => {
    setCardsPerPage(parseInt(value.target.value));
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

  const filteredCards = useMemo(() => values.filter((card) => {
    const cardValues = Object.values(card);
    const searchTerms = searchQuery.split(',');

    if (doIncludeAll) {
      return searchTerms.every((term) => {
        return cardValues.some((value: any) => {
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
        return cardValues.some((value: any) => {
          return typeof value !== 'object' &&
          value.toString().toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(
            term.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          );
        }
        );
      });
    }
  }), [values, searchQuery, doIncludeAll]);

  const totalPages = useMemo(() => {
    const tot = Math.ceil((filteredCards?.length || 0) / cardsPerPage);
    if (currentPage > tot) {
      setCurrentPage(1);
    }
    return tot;
  }, [cardsPerPage, currentPage, filteredCards?.length]);
  const pageNumbers = useMemo(() => generatePageNumbers(currentPage, totalPages, 5), [currentPage, totalPages]);

  const startIndex = useMemo(() => (currentPage - 1) * cardsPerPage, [currentPage, cardsPerPage]);
  const endIndex = useMemo(() => startIndex + cardsPerPage, [startIndex, cardsPerPage]);

  const displayedCards = useMemo(() => filteredCards?.slice(startIndex, endIndex) || [], [filteredCards, startIndex, endIndex]);

  return (
    <Card className="super-big-card">
      <CardHeader floated={false} shadow={false} className="super-big-header">
        <div className="super-big-header-content">
          <div>
            {tableTitle &&
              <p className='super-title'>
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
              <MySelect label='Items per page' value={cardsPerPage.toString()} onChange={handleCardsPerPageChange}>
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
           <AccordionHeader className='py-2' onClick={() => setIsSubmenuOpen((prev) => !prev)}>Sub options</AccordionHeader>

           <AccordionBody>

             {subOptions}
           </AccordionBody>
         </Accordion>
        }
      </CardHeader>

      <CardBody className='flex gap-2 flex-wrap justify-center my-cards'>

        { displayedCards.length > 0 && displayedCards.map((card) => customCard(card)) ||

          <div className='text-6xl text-blue-500 font-bold text-center'>
            <br/>0 results<br/><br/>
          </div>
        }

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
