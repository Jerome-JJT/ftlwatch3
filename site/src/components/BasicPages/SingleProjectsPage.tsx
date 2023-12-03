import React from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Dialog,
  DialogBody,
  DialogHeader,
} from '@material-tailwind/react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { commonTitle } from 'Utils/commonTitle';
import { useParams } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';


export function SingleProjectPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [values, setValues] = React.useState<any>(undefined);
  const [focusSubject, setFocusSubject] = React.useState<any | undefined>(undefined);


  const params = useParams();
  const id = Number(params.id);

  React.useEffect(() => {document.title = commonTitle('Single project page');}, []);

  React.useEffect(() => {
    axios
      .get(`/?page=basic&action=get_project&id=${id}`,
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
  }, [addNotif, id]);


  return (
    <div className='my-content !flex-row items-center'>
      { values !== undefined &&

        <Card key={values.id}
          className="big-card grow max-w-[800px] border-black border-2 overflow-hidden">

          <CardHeader floated={false} className='text-center shadow-none text-xl m-0 mt-1 dark:bg-black/20'>
            <p>
              <a href={`https://projects.intra.42.fr/projects/${values.slug}`}>{values.name}</a>
            </p>
          </CardHeader>

          <CardBody className="grid grid-cols-2 grow gap-4 text-center align-center p-2">

            <div className='blue-gray grid grid-cols-2 gap-1 place-content-start'>

              <p>Cursus</p>
              <p>{values.main_cursus}</p>

              {(values.difficulty !== undefined && values.difficulty !== null) && <>
                <p>Difficulty</p>
                <p>
                  {values.difficulty}
                </p>
              </>
              }

              {(values.session_duration_days !== undefined && values.session_duration_days !== null) && <>
                <p>Duration</p>
                <p>
                  {values.session_duration_days ? `${values.session_duration_days} days` : values.session_estimate_time }
                </p>
              </>
              }

              {values.session_scale_duration && <>
                <p>Slot</p>
                <p>
                  {values.session_scale_duration / 60} minutes
                </p>
              </>
              }

              {values.rule_retry_delay && <>
                <p>Cooldown</p>
                <p>
                  {values.rule_retry_delay} jours
                </p>
              </>
              }
            </div>

            <div className='blue-gray grid grid-cols-2 gap-1 place-content-start grow'>
              <p>Exam</p>
              <div><Checkbox crossOrigin={undefined} containerProps={{ className: 'p-0' }} checked={values.is_exam} readOnly disabled /></div>

              <p>Solo</p>
              <div><Checkbox crossOrigin={undefined} containerProps={{ className: 'p-0' }} checked={values.session_is_solo} readOnly disabled /></div>

              <p>Moulinette</p>
              <div><Checkbox crossOrigin={undefined} containerProps={{ className: 'p-0' }} checked={values.session_has_moulinette} readOnly disabled /></div>

              <p>Lausanne</p>
              <div><Checkbox crossOrigin={undefined} containerProps={{ className: 'p-0' }} checked={values.has_lausanne} readOnly disabled /></div>

              {values.session_correction_number && <>
                <p>Correction</p>
                <p>{values.session_correction_number}</p>
              </>
              }

              {(values.rule_min || values.rule_max) && <>
                <p>
                  Min: {values.rule_min || '-'}
                </p>
                <p>
                  Max: {values.rule_max || '-'}
                </p>
              </>
              }

              {values.session_terminating_after && <>
                <p>Auto close</p>
                <p>
                  {values.session_terminating_after} jours
                </p>
              </>
              }

            </div>

            <textarea className='col-span-2 w-full grow border p-2' readOnly defaultValue={values.session_description} />


            <table className='my-text w-full col-span-2'>
              <tbody>
                { values.rules.map((rule: any) => {
                  return <tr key={rule.id}>
                    <td className='p-2 border border-white'>{rule.id}</td>
                    <td className='p-2 border border-white'>{rule.name}</td>
                    <td className='p-2 border border-white'>{rule.kind}</td>
                    <td className='p-2 border border-white'>{rule.description}</td>
                    <td className='p-2 border border-white'>{rule.slug}</td>
                  </tr>;
                })
                }
              </tbody>
            </table>

            <table className='my-text w-full col-span-2'>
              <tbody>

                { values.subjects.map((subject: any) => {
                  return <tr key={subject.id}>
                    <td className='p-2 border border-white'>{subject.id}<br/>{subject.title_hash}</td>
                    <td className='p-2 border border-white'>
                      <textarea cols={25} rows={5} defaultValue={subject.title} />
                    </td>
                    <td className='p-2 border border-white'>{subject.project_slug}</td>
                    <td className='p-2 border border-white'>
                      <Button onClick={() => setFocusSubject(subject)}>
                      List ({subject.subjects.length})
                      </Button>
                    </td>
                    {/* <td className='p-2 border border-white'>{subject.description}</td>
                  <td className='p-2 border border-white'>{subject.slug}</td> */}
                  </tr>;
                })
                }
              </tbody>
            </table>

            <Dialog open={focusSubject !== undefined} handler={() => setFocusSubject(undefined)}>
              <div className="flex flex-row items-center justify-between pr-4 gap-1">

                <DialogHeader className='grow w-96 truncate' title={focusSubject?.title || ''}>{focusSubject?.title || ''}</DialogHeader>
                <AiOutlineClose onClick={() => setFocusSubject(undefined)}
                  className='rounded-lg border-transparent border-2 hover:bg-gray-100 hover:border-black hover:text-red-500' size='30' />
              </div>

              {focusSubject?.subjects && <DialogBody className='grid grid-cols-3 auto-cols-max gap-y-2 justify-center mb-2' divider>
                {
                  focusSubject?.subjects.map((link: {id: string, url: string, date: string}) =>
                    <React.Fragment key={link.id}>
                      <a href={link.url} className='text-black col-span-2'>{link.url}</a>
                      <span>{link.date}</span>
                    </React.Fragment>)
                }
              </DialogBody>
              }
            </Dialog>

          </CardBody>

          <CardFooter className='flex flex-col bg-black/20 p-1'>
            <p className='text-center'>
              {values.id} {values.slug}
            </p>
          </CardFooter>
        </Card>

      }
    </div>
  );
}
