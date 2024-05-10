import React from 'react';
import { commonTitle } from 'Utils/commonTitle';

import { Card } from '@material-tailwind/react';


export function PeaksDaysPage(): JSX.Element {
  React.useEffect(() => {document.title = commonTitle('Users computers');}, []);

  return (
    <Card className="big-card grow mt-4 !mb-2 mx-2">
      <p className="super-description">
        Shows different people connections per days and maximum connections at the same time.
        Filterable by pool or cursus people.
      </p>

      <iframe className='grow' src="/secure_static/peaks_days"></iframe>

    </Card>

  );
}
