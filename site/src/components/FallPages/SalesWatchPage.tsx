import React from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import { SuperTable } from 'Common/SuperTable';
import { useNotification } from 'Notifications/NotificationsProvider';
import styled from 'styled-components';
import { ColumnProps } from 'Utils/columnsProps';
import { commonTitle } from 'Utils/commonTitle';



const StyledTableau = styled.div`
  tbody tr td {
    height: 100px;
    min-height: 100px;
    max-height: 100px;
    padding: 4px;
  }
`;

export function SalesWatchPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Sales');}, []);

  React.useEffect(() => {
    axios
      .get('/?page=points&action=get_sales',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {

          setColumns(res.data.columns);

          const displayValues = res.data.values;

          setValues(displayValues);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif]);

  return (
    <div className='my-content'>
      <StyledTableau>

        <SuperTable
          columns={columns}
          values={values}

          tableTitle='Tableau sales'
          tableDesc='Regroup informations about sales'
          options={[100]}
        />
      </StyledTableau>
    </div>
  );
}
