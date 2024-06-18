import React from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import { SuperTable } from 'Common/SuperTable';
import { useNotification } from 'Notifications/NotificationsProvider';
import { ColumnProps } from 'Utils/columnsProps';
import { commonTitle } from 'Utils/commonTitle';



export function OffersPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Offers page');}, []);


  React.useEffect(() => {
    axios
      .get('/?page=offers&action=get_offers',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setColumns(res.data.columns as ColumnProps[]);

          const displayValues = res.data.values.map((offer: any) => {
            res.data.columns.forEach((col: ColumnProps) => {

              if (col.field === 'title') {
                offer[`_${col.field}`] = offer[col.field];
                offer[col.field] = <a className='text-center' href={`https://companies.intra.42.fr/en/offers/${offer['id']}`}>{offer[col.field]}</a>;
              }

              else if (col.field === 'big_description') {
                offer[`_${col.field}`] = offer[col.field];
                offer[col.field] = <textarea className='w-80 h-36 bg-black/10' readOnly defaultValue={offer.big_description}/>;
              }
            });

            return offer;
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
      <SuperTable
        columns={columns}
        values={values}
        indexColumn={true}

        defaultSearch='Switzerland'

        tableTitle='Offers'
        tableDesc='Offers'
        options={[25, 50, 100]}
        // reloadFunction={() => { setValues([]); }}
      />
    </div>
  );
}
