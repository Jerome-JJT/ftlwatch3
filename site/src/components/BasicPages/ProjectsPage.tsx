import React, { useMemo } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@material-tailwind/react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { SuperCards } from 'Common/SuperCards';
import classNames from 'classnames';
import Separator from 'Common/Separator';
import { commonTitle } from 'Utils/commonTitle';
import ProjectDisplay from 'Common/ProjectDisplay';
import { useSearchParams } from 'react-router-dom';
import { objUrlEncode } from 'Utils/objUrlEncode';


export function ProjectsPage(): JSX.Element {
  const { addNotif } = useNotification();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultCursus = searchParams.get('cursus');

  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  const [cursus, setCursus] = React.useState<any[] | undefined>(undefined);
  const [selectedCursus, setSelectedCursus] = React.useState<number | undefined>(
    (defaultCursus !== null && !Number.isNaN(parseInt(defaultCursus))) ? parseInt(defaultCursus) : 21
  );

  React.useEffect(() => { document.title = commonTitle('Project page'); }, []);

  React.useEffect(() => {
    axios
      .get('/?page=basic&action=get_projects',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {

          setValues(res.data.values);
          setCursus(res.data.cursus);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif]);

  React.useEffect(() => {
    const args = objUrlEncode({
      ...Object.fromEntries(searchParams.entries()),
      "cursus": selectedCursus
    });
    window.history.replaceState(null, '', `${(args && args !== '') ? `?${args}` : ''}`);
    setSearchParams(args);

  }, [selectedCursus]);


  function ProjectCard(card: any): JSX.Element {
    return (
      <Card key={card.id}
        className="w-96 border-black border-2 overflow-hidden">

        <CardHeader floated={false} className='text-center shadow-none text-xl m-0 mt-1 dark:bg-black/20'>
          <p>
            <a href={`https://projects.intra.42.fr/projects/${card.slug}`}>{card.name}</a>
          </p>
        </CardHeader>

        <CardBody className="grid grid-cols-2 grow gap-4 text-center align-center p-2">

          <ProjectDisplay project={card} link={true} />

        </CardBody>

        <CardFooter className='flex flex-col bg-black/20 p-1 h-40'>
          <textarea className='w-full grow border p-2' readOnly defaultValue={card.session_description} />
          <p className='text-center'>
            {card.id} {card.slug}
          </p>
        </CardFooter>
      </Card>
    );
  }



  const importantCursus = useMemo(() => [1, 3, 4, 9, 21], []);
  const sortedCursus = useMemo(() => [...cursus || []].sort((a, b): number => {

    const aImportant = importantCursus.includes(a.id);
    const bImportant = importantCursus.includes(b.id);

    if (aImportant && !bImportant) {
      return -1;
    }
    else if (!aImportant && bImportant) {
      return 1;
    }
    return 0;

  }), [cursus, importantCursus]);


  const subOptions = useMemo(() => (
    <>
      <div className='flex flex-wrap gap-2 justify-evenly'>

        {sortedCursus && sortedCursus.map((cursu) => {
          return (
            <Button
              key={cursu.id}
              className={classNames(cursu.id === selectedCursus ? 'selected-option' : 'available-option')}
              onClick={() => { setSelectedCursus((prev) => prev !== cursu.id ? cursu.id : undefined); }}
            >
              {cursu.name}
            </Button>
          );
        })}
      </div>
      <Separator />
    </>

  ), [selectedCursus, sortedCursus]);



  const filteredProjects = useMemo(() => values?.filter((project) => {
    return selectedCursus === undefined || selectedCursus === project.main_cursus;
  }), [values, selectedCursus]);


  return (
    <div className='my-content'>
      <SuperCards
        values={filteredProjects}
        customCard={ProjectCard}

        subOptions={subOptions}

        tableTitle='Projects'
        tableDesc='All existing projects with cursus, inscription and corrections informations. Also past subjects available in details'
        options={[25, 50, 100]}
      // reloadFunction={() => { setValues([]); }}
      />
      {/* <Dialog open={focusImage !== undefined} handler={() => setFocusImage(undefined)}>
        <div className="flex items-center justify-between pr-4">
          <DialogHeader>{focusText || ''}</DialogHeader>
          <AiOutlineClose onClick={() => setFocusImage(undefined)}
            className='rounded-lg border-transparent border-2 hover:bg-gray-100 hover:border-black hover:text-red-500' size='30' />
        </div>
        <DialogBody className='flex justify-center' divider>
          <img className='max-h-[400px]' src={focusImage && `https://cdn.intra.42.fr/${focusImage.replace('/uploads/', '')}`}/>
        </DialogBody>
      </Dialog> */}
    </div>
  );
}
