import React from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import { SuperTable } from 'Common/SuperTable';
import { useNotification } from 'Notifications/NotificationsProvider';
import { ColumnProps } from 'Utils/columnsProps';
import { commonTitle } from 'Utils/commonTitle';
import { Button, Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import { AiOutlineClose } from 'react-icons/ai';



export function UnmatchedSubjectsPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  const [focusSubject, setFocusSubject] = React.useState<any | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Unmatched ubjects page');}, []);


  React.useEffect(() => {
    axios
      .get('/?page=projects&action=get_unmatched_subjects',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setColumns(res.data.columns as ColumnProps[]);

          const displayValues = res.data.values.map((subject: any) => {
            res.data.columns.forEach((col: ColumnProps) => {
              if (col.field === 'details') {
                subject[col.field] = <Button onClick={() => setFocusSubject(subject)}>
                  Subjects ({subject['subjects'].length})
                </Button>;
              }
              else if (col.field === 'title') {
                subject[`_${col.field}`] = subject[col.field];
                subject[col.field] = <textarea cols={25} rows={5} readOnly defaultValue={subject['title']}/>;

              }
            });

            return subject;
          });
          setValues(displayValues);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif]);


  return (
    <div className='my-content'>
      {(columns && values) &&
        <SuperTable
          columns={columns}
          values={values}

          tableTitle='Subjects'
          options={[25, 50, 100]}
          // reloadFunction={() => { setValues([]); }}
        />
      }
      <Dialog open={focusSubject !== undefined} handler={() => setFocusSubject(undefined)}>
        <div className="flex flex-row items-center justify-between pr-4 gap-1">

          <DialogHeader className='grow w-96 truncate' title={focusSubject?._title || ''}>{focusSubject?._title || ''}</DialogHeader>
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
    </div>
  );
}
