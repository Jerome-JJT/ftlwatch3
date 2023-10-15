import React, { useCallback } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import { Input, Button, Checkbox } from '@material-tailwind/react';

import { SuperTable } from 'Common/SuperTable';
import { useNotification } from 'Notifications/NotificationsProvider';
import MySelect from 'Common/MySelect';
import { ColumnProps } from 'Utils/columnsProps';
import { commonTitle } from 'Utils/commonTitle';



export function ProjectsVisibilityPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Projects visibility page');}, []);

  const modifyProjectOrder = useCallback((projectId: number, order: string): Promise<boolean> => {
    return axios
      .post('/?page=admin&action=project_set',
        `projectId=${projectId}&order=${order}`, { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          // addNotif('teest2', 'question', false);
        } //
        return true;
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
        return false;
      });
  }, [addNotif]);


  const modifyProjectVisibility = useCallback((projectId: number, hidden: boolean): Promise<boolean> => {
    return axios
      .post('/?page=admin&action=project_set',
        `projectId=${projectId}&hidden=${hidden}`, { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          // localStorage.setItem('token', res.data.access_token);
        } //
        return true;
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
        return false;
      });
  }, [addNotif]);


  const modifyProjectType = useCallback((projectId: number, typeId: string): Promise<boolean> => {
    return axios
      .post('/?page=admin&action=project_set',
        `projectId=${projectId}&typeId=${typeId}`, { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          // addNotif('teest2', 'question', false);
        } //
        return true;
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
        return false;
      });
  }, [addNotif]);



  React.useEffect(() => {
    axios
      .get('/?page=admin&action=projects_get',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setColumns(res.data.columns as ColumnProps[]);

          const displayValues = res.data.values.map((project: any) => {
            res.data.columns.forEach((col: ColumnProps) => {
              if (col.field === 'corder') {
                const corderId = `corder-${project.id}`;
                project[col.field] =
                    <div className="relative flex w-full max-w-[24rem]">
                      <Input id={corderId} label='corder' type='text' defaultValue={project[col.field]}/>
                      <Button
                        size="sm"
                        className="!absolute right-1 top-1 rounded"
                        onClick={() => { void modifyProjectOrder(project.id, (document.getElementById(corderId) as HTMLInputElement).value || '98'); }}
                      >
                        Save
                      </Button>
                    </div>;
              }

              else if (col.field === 'hidden') {

                project[col.field] = <Checkbox
                  id={`${project.id}-${col.field}`}
                  defaultChecked={project[col.field]}
                  onClick={async (e: any) => {
                    if (!(await modifyProjectVisibility(project.id, e.target.checked))) {
                      e.target.checked = !e.target.checked;
                    }
                  }}
                />;
              }

              else if (col.field === 'project_type') {
                project[col.field] = <MySelect
                  defaultValue={project.project_type_id?.toString() || 'null'}
                  onChange={(v) => { void modifyProjectType(project.id, v.target.value || 'null'); }}>

                  <option key='null' value='null'>null</option>
                  {res.data.project_types.map((type: any) => {
                    return <option key={type.id} value={type.id.toString()}>{type.name}</option>;
                  })}

                </MySelect>;
              }
            });

            return project;
          });
          setValues(displayValues);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif, modifyProjectOrder, modifyProjectType, modifyProjectVisibility]);


  return (
    <div className='mx-8 mt-2'>
      {(columns && values) &&
        <SuperTable
          columns={columns}
          values={values}
          tableTitle='Pages'
          options={[10, 20, 30]}
          // reloadFunction={() => { setValues([]) }}
        />
      }
    </div>
  );
}
