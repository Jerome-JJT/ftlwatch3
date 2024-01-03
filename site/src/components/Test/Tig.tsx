import React from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLogin } from 'Hooks/LoginProvider';
import { commonTitle } from 'Utils/commonTitle';

export default function TigPage(): JSX.Element {

  const [pageMessage, setPageMessage] = React.useState('');

  React.useEffect(() => {
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
    }
  );

  return (
    <>
      <div className="mt-3 h-6 text-center text-sm">{pageMessage}</div>
    </>
  );
}
