import React from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  Dialog,
  DialogBody,
  Tooltip,
} from '@material-tailwind/react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { SuperCards } from 'Common/SuperCards';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { commonTitle } from 'Utils/commonTitle';





export function InternshipsPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [values, setValues] = React.useState<any[] | undefined>();
  const [focusText, setFocusText] = React.useState<string | undefined>(undefined);

  // const [currentFilter, setCurrentFilter] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Internships');}, []);

  function InternshipCard(card: any): JSX.Element {


    return (
      <Card key={card.cid} className="flex w-[420px] border-black border-2">

        <CardBody className="flex flex-col grow justify-start text-center align-center gap-2 p-2 mt-4">

          <div className='flex flex-col justify-evenly'>
            <p color="blue-gray">Final Mark : {card.final_mark}</p>

            <div className="flex items-center justify-center">
              <p color="blue-gray">State : {card.status}</p>
              {card.status === 'finished' && (
                <Checkbox icon={card.is_validated ? <AiOutlineCheck size='18' /> : <AiOutlineClose size='18' /> }
                  color={card.is_validated ? 'green' : 'deep-orange'} crossOrigin={undefined} checked={true} readOnly disabled></Checkbox>
              )}
            </div>
          </div>


          <table className='flex-grow'>
            <tbody>
              {
                Object.entries(card.subs as any[]).map((project) => {

                  return <tr key={project[0]} className='border border-black'>
                    <td className='border border-black px-1'>
                      <a href={`https://projects.intra.42.fr/projects/${project[1]['project_slug']}/projects_users/${project[1]['projects_user_id']}`}>{project[0]}</a>
                    </td>

                    <td className='border border-black px-1'>{project[1]['final_mark']}</td>
                    <td className='border border-black px-1'>{project[1]['time_at']?.split(' ')[0]}</td>

                    <td className='border border-black px-1'>
                      { project[1]['comment'] !== undefined && project[1]['comment'] !== null && project[1]['comment'] !== '' && (
                        <Button className='w-auto p-2'
                          onClick={() => { setFocusText((prev) => prev !== project[1]['comment'] ? project[1]['comment'] : undefined);}}
                        >
                              Comment
                        </Button>
                      )}
                    </td>

                    <td className='border border-black px-1'>
                      { project[1]['feedback'] !== undefined && project[1]['feedback'] !== null && project[1]['feedback'] !== '' && (
                        <Button className='w-auto p-2'
                          onClick={() => { setFocusText((prev) => prev !== project[1]['feedback'] ? project[1]['feedback'] : undefined);}}
                        >
                            Feedback
                        </Button>
                      )}
                    </td>

                  </tr>;
                })
              }
            </tbody>
          </table>
        </CardBody>

        <CardFooter className="flex items-center bg-black/20 justify-between p-3 pb-1">
          <div className="flex items-center gap-4 -space-x-3">
            <Tooltip key={card.id} content={card.login}>
              <a href={`https://profile.intra.42.fr/users/${card.login}`}>
                <Avatar
                  size="sm"
                  variant="circular"
                  src={card.avatar_url}
                  className="border-2 border-white hover:z-10 bg-[#008080]"
                />
              </a>
            </Tooltip>

            <p color="blue-gray">
              <a href={`https://projects.intra.42.fr/projects/${card.project_slug}/projects_users/${card.projects_user_id}`}>{card.project_slug}</a>
            </p>
          </div>
        </CardFooter>
      </Card>
    );
  }

  React.useEffect(() => {
    axios
      .get('/?page=projects&action=get_internships',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setValues(res.data.values);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif]);

  //
  return (
    <div className='my-content'>
      {(values) &&
        <SuperCards
          values={values || []}
          customCard={InternshipCard}

          // subOptions={subOptions}

          tableTitle='Internships'
          tableDesc={'Internships projects'}
          options={[50, 100]}
          // reloadFunction={() => { setValues([]); }}
        />
      }

      <Dialog open={focusText !== undefined} handler={() => setFocusText(undefined)}>
        <div className="flex items-center justify-end p-2 pr-4 border-b border-gray-300">
          <AiOutlineClose onClick={() => setFocusText(undefined)}
            className='rounded-lg border-transparent border-2 hover:bg-gray-100 hover:border-black hover:text-red-500' size='30' />
        </div>
        <DialogBody className='flex justify-center'>
          <p>
            {focusText}
          </p>
        </DialogBody>
      </Dialog>
    </div>
  );
}
