import React, { LegacyRef } from 'react';
import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import { SuperTable } from 'Common/SuperTable';
import { useNotification } from 'Notifications/NotificationsProvider';
import { ColumnProps } from 'Utils/columnsProps';
import { commonTitle } from 'Utils/commonTitle';
import * as d3 from 'https://cdn.skypack.dev/d3@7.6.1';

import { Card } from '@material-tailwind/react';


export function PeaksDaysPage(): JSX.Element {
  const { addNotif } = useNotification();

  const [columns, setColumns] = React.useState<ColumnProps[] | undefined>(undefined);
  const [values, setValues] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {document.title = commonTitle('Users computers');}, []);

  return (
    <Card className="big-card grow mt-4 !mb-2 mx-2">

      <iframe className='grow' src="/static/ttest.html"></iframe>

    </Card>

  );
}
