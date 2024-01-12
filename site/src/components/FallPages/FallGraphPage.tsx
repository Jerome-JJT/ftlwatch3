import React from 'react';
import { commonTitle } from 'Utils/commonTitle';
import { useSearchParams } from 'react-router-dom';

import { Card } from '@material-tailwind/react';


export function FallGraphPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const graph = searchParams.get('graph');


  React.useEffect(() => {document.title = commonTitle('Fall graph');}, []);

  return (
    <Card className="big-card grow mt-4 !mb-2 mx-2">
      <p className="super-description">
        Shows connections between peoples, based on people evaluations.
      </p>

      <iframe className='grow' src={`/secure_static/${graph}`}></iframe>

    </Card>

  );
}
