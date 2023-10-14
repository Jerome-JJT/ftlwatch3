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
import { AiFillGift } from 'react-icons/ai';
import classNames from 'classnames';
import Separator from 'Common/Separator';

class CursusProps {
  id: string = '';
  name: string = '';
}
export function ProjectsPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [values, setValues] = React.useState<any[]>([]);

  const [cursus, setCursus] = React.useState<any[] | undefined>(undefined);
  const [selectedCursus, setSelectedCursus] = React.useState<CursusProps | undefined>(undefined);


  React.useEffect(() => {
    axios
      .get('/?page=basic&action=get_projects',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          if (res.data.values.length > 0) {

            setValues(res.data.values);
            setCursus(res.data.cursus);
          }
          else {
            addNotif('No results found', 'error');
          }
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif]);



  function ProjectCard(card: any): JSX.Element {
    return (
      <Card key={card.id}
        className="flex w-84 min-w-84 max-w-84 flex-col border-black border-2 overflow-hidden"
        style={{ backgroundColor: card.color }}>

        <CardHeader floated={false} className='text-center shadow-none text-xl m-0 mt-1'>
          <p>
            {card.name}
          </p>
        </CardHeader>

        <CardBody className="grid grid-cols-2 grow gap-4 text-center align-center p-2">

          <div className='blue-gray grid grid-cols-2 gap-1 place-content-start'>

            <p>Cursus</p>
            <div>{card.main_cursus}</div>

            <p>Difficulty</p>
            <p>
              {card.difficulty}
            </p>

            <p>Duration</p>
            <p>
              {card.session_duration_days ? `${card.session_duration_days} days` : card.session_estimate_time }
            </p>

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

            {card.session_correction_number && <>
              <p>Correction</p>
              <p>{card.session_correction_number}</p>
            </>
            }

            {(card.rule_min || card.rule_max) && <>
              <p>
                Min: {card.rule_min || '-'}
              </p>
              <p >
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
            {card.slug}
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
              //  className="inline-block rounded-full bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
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
    <div className='mx-8 mt-2'>
      {(values) &&
        <SuperCards
          values={filteredProjects}
          customCard={ProjectCard}

          subOptions={subOptions}

          tableTitle='Projects'
          options={[10, 25, 50, 100]}
          reloadFunction={() => { setValues([]); }}
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
