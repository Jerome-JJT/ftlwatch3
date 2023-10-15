import React, { useMemo } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import { SuperTable } from 'Common/SuperTable';
import { useNotification } from 'Notifications/NotificationsProvider';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Dialog, DialogBody } from '@material-tailwind/react';
import Separator from 'Common/Separator';
import classNames from 'classnames';
import { comparePoolfilters } from 'Utils/comparePoolfilters';
import { AiOutlineClose } from 'react-icons/ai';
import { ColumnProps } from 'Utils/columnsProps';
import { commonTitle } from 'Utils/commonTitle';


class PoolFilterProps {
  name: string = '';
  hidden: boolean = true;
}

const StyledTableau = styled.div`
  tbody tr td {
    height: 100px;
    min-height: 100px;
    max-height: 100px;
    padding: 4px;
  }
`;

export function TableauPage(): JSX.Element {
  const { addNotif } = useNotification();
  const [searchParams] = useSearchParams();
  const defaultFilter = searchParams.get('filter');
  const defaultProjects = searchParams.get('projects');

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  const [poolFilters, setPoolFilters] = React.useState<PoolFilterProps[] | undefined>(undefined);
  const [usedFilter, setUsedFilter] = React.useState<string | undefined>(defaultFilter !== null ? defaultFilter : 'cursus');

  const [projects, setProjects] = React.useState<string[] | undefined>(undefined);
  const [usedProjects, setUsedProjects] = React.useState<string | undefined>(defaultProjects !== null ? defaultProjects : 'common-core');

  const [focusImage, setFocusImage] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Tableau');}, []);

  React.useEffect(() => {
    window.history.replaceState(null, '', `/tableau?${usedFilter ? `filter=${usedFilter}` : ''}${usedProjects ? `&projects=${usedProjects}` : ''}`);
    axios
      .get(`/?page=tableau&action=get${usedFilter ? `&filter=${usedFilter}` : ''}${usedProjects ? `&projects=${usedProjects}` : ''}`,
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setColumns((prev) =>
            (res.data.columns as ColumnProps[]).map((c) => ({
              ...c,
              visible: prev?.find((cf) => cf.field === c.field)?.visible ?? true,
            }))
          );

          setPoolFilters(() => {
            const pf = res.data.poolfilters as PoolFilterProps[];
            pf.sort((a, b) => comparePoolfilters(a.name, b.name));
            return pf;
          });

          setProjects(res.data.projects as string[]);


          const displayValues = res.data.values.map((user: any) => {
            res.data.columns.forEach((col: ColumnProps) => {
              if (col.field === 'login') {
                user[col.field] = <a
                  href={`https://profile.intra.42.fr/users/${user.login}`}
                >{user.login}</a>;
              }
              else if (col.field === 'avatar_url') {
                const avatar_url = user[col.field];
                user[col.field] = <img
                  src={avatar_url}
                  alt={user.login}
                  onClick={() => setFocusImage(avatar_url)}
                  className='max-h-full max-w-[60px] rounded-lg border-2 border-transparent cursor-pointer hover:border-black'
                />;
              }
            });

            return user;
          });

          setValues(displayValues);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif, usedFilter, usedProjects]);

  const subOptions = useMemo(() => (
    <>
      <div className='flex flex-wrap gap-2 justify-evenly max-h-80 overflow-y-scroll'>

        {poolFilters && poolFilters.map((filter) => {
          return (
            <Button
              key={filter.name}
              className={classNames(filter.name === usedFilter ? 'selected-option' : (filter.hidden ? 'hidden-option' : 'available-option' ))}
              onClick={() => setUsedFilter(filter.name) }
            >
              {filter.name}
            </Button>
          );
        })}
      </div>

      <Separator></Separator>

      <div className='flex flex-wrap gap-2 justify-evenly max-h-80 overflow-y-scroll'>

        <Button
          key={'all'}
          className='available-option'

          onClick={() =>
            setColumns((prev) => prev && prev.map((pc) => {
              return { ...pc, visible: true };
            }))
          }
        >
          All
        </Button>

        <Button
          key={'none'}
          className='available-option'

          onClick={() =>
            setColumns((prev) => prev && prev.map((pc) => {
              return { ...pc, visible: false };
            }))
          }
        >
          None
        </Button>

        {columns && columns.map((column) => {
          return (
            <Button
              key={column.field}
              className={classNames(column.visible ? 'selected-option' : 'available-option' )}

              onClick={() =>
                setColumns((prev) => prev && prev.map((pc) => {
                  if (pc.field === column.field) {
                    return { ...pc, visible: !pc.visible };
                  }
                  return pc;
                }))
              }
            >
              {column.label}
            </Button>
          );
        })}
      </div>

      <Separator></Separator>

      <div className='flex flex-wrap gap-2 justify-evenly max-h-80 overflow-y-scroll'>

        {projects && projects.map((project) => {
          return (
            <Button
              key={project}
              className={classNames(project === usedProjects ? 'selected-option' : 'available-option' )}

              onClick={() => setUsedProjects(project) }
            >
              {project}
            </Button>
          );
        })}
      </div>

      <Separator></Separator>
    </>

  ), [columns, poolFilters, projects, usedFilter, usedProjects]);

  //
  return (
    <div className='mx-8 mt-2'>
      {(columns && values) &&
        <StyledTableau>

          <SuperTable
            columns={columns}
            values={values}

            subOptions={subOptions}

            tableTitle='Tableau'
            options={[10, 25, 50, 100]}
            reloadFunction={() => { setValues([]); }}
          />
        </StyledTableau>
      }
      <Dialog open={focusImage !== undefined} handler={() => setFocusImage(undefined)}>
        <div className="flex items-center justify-end p-2 pr-4">
          <AiOutlineClose onClick={() => setFocusImage(undefined)}
            className='rounded-lg border-transparent border-2 hover:bg-gray-100 hover:border-black hover:text-red-500' size='30' />
        </div>
        <DialogBody className='flex justify-center' divider>
          <img className='max-h-[400px]' src={focusImage}/>
        </DialogBody>
      </Dialog>
    </div>
  );
}
