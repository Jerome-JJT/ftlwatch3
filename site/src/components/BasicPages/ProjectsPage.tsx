import React, { useMemo } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
} from '@material-tailwind/react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { SuperCards } from 'Common/SuperCards';
import classNames from 'classnames';
import Separator from 'Common/Separator';
import { commonTitle } from 'Utils/commonTitle';

class CursusProps {
  id: string = '';
  name: string = '';
}
export function ProjectsPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [values, setValues] = React.useState<any[]>([]);

  const [cursus, setCursus] = React.useState<any[] | undefined>(undefined);
  const [selectedCursus, setSelectedCursus] = React.useState<CursusProps | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Rules page');}, []);

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



  function ProjectCard(card: any): JSX.Element {
    return (
      <Card key={card.id}
        className="w-96 border-black border-2 overflow-hidden">

        <CardHeader floated={false} className='text-center shadow-none text-xl m-0 mt-1 dark:bg-black/20'>
          <p>
            {card.name}
          </p>
        </CardHeader>

        <CardBody className="grid grid-cols-2 grow gap-4 text-center align-center p-2">

          <div className='blue-gray grid grid-cols-2 gap-1 place-content-start'>

            <p>Cursus</p>
            <p>{card.main_cursus}</p>

            {(card.difficulty !== undefined && card.difficulty !== null) && <>
              <p>Difficulty</p>
              <p>
                {card.difficulty}
              </p>
            </>
            }

            {(card.session_duration_days !== undefined && card.session_duration_days !== null) && <>
              <p>Duration</p>
              <p>
                {card.session_duration_days ? `${card.session_duration_days} days` : card.session_estimate_time }
              </p>
            </>
            }

            {card.session_scale_duration && <>
              <p>Slot</p>
              <p>
                {card.session_scale_duration / 60} minutes
              </p>
            </>
            }

            {card.cooldown && <>
              <p>Cooldown</p>
              <p>
                {card.rule_retry_delay} jours
              </p>
            </>
            }
          </div>

          <div className='blue-gray grid grid-cols-2 gap-1 place-content-start grow'>
            <p>Exam</p>
            <div><Checkbox containerProps={{ className: 'p-0' }} checked={card.is_exam} readOnly disabled /></div>

            <p>Solo</p>
            <div><Checkbox containerProps={{ className: 'p-0' }} checked={card.session_is_solo} readOnly disabled /></div>

            <p>Moulinette</p>
            <div><Checkbox containerProps={{ className: 'p-0' }} checked={card.session_has_moulinette} readOnly disabled /></div>

            <p>Lausanne</p>
            <div><Checkbox containerProps={{ className: 'p-0' }} checked={card.has_lausanne} readOnly disabled /></div>

            {card.session_correction_number && <>
              <p>Correction</p>
              <p>{card.session_correction_number}</p>
            </>
            }

            {(card.rule_min || card.rule_max) && <>
              <p>
                Min: {card.rule_min || '-'}
              </p>
              <p>
                Max: {card.rule_max || '-'}
              </p>
            </>
            }

            {card.session_terminating_after && <>
              <p>Auto close</p>
              <p>
                {card.session_terminating_after} jours
              </p>
            </>
            }

          </div>

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
              className={classNames(cursu.id === selectedCursus ? 'selected-option' : 'available-option' )}
              onClick={() => { setSelectedCursus((prev) => prev !== cursu.id ? cursu.id : undefined); } }
            >
              {cursu.name}
            </Button>
          );
        })}
      </div>
      <Separator />
    </>

  ), [selectedCursus, sortedCursus]);



  const filteredProjects = useMemo(() => values.filter((project) => {
    return selectedCursus === undefined || selectedCursus === project.main_cursus;
  }), [values, selectedCursus]);


  return (
    <div className='my-content'>
      {(values) &&
        <SuperCards
          values={filteredProjects}
          customCard={ProjectCard}

          subOptions={subOptions}

          tableTitle='Projects'
          options={[10, 25, 50, 100]}
          // reloadFunction={() => { setValues([]); }}
        />
      }
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
