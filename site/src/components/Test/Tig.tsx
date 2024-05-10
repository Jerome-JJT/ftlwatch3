import React from 'react';
import axios from 'axios';

export default function TigPage(): JSX.Element {

  const [pageMessage, setPageMessage] = React.useState('');
  const renderAfterCalled = React.useRef(false);

  React.useEffect(() => {
    if (!renderAfterCalled.current) {

      axios
        .get('/?page=specials&action=tig', { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 201) {
            setPageMessage('Login successful, redirecting...');
          }
        })
        .catch(() => {
          setPageMessage('Timeout / once per day');
        });

      renderAfterCalled.current = true;
    }
  }
  );

  return (
    <>
      <div className="mt-3 h-6 text-center text-sm">{pageMessage}</div>
    </>
  );
}
