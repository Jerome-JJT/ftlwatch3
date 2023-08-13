import React from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { type UseLoginDto } from '../Hooks/useLogin';

interface LoginApiProps {
  loginer: UseLoginDto
}

export default function LoginApi ({ loginer }: LoginApiProps): JSX.Element {
  const [pageMessage, setPageMessage] = React.useState('42 api loading');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const code = searchParams.get('code');

  React.useEffect(() => {
    if (code != null) {
      axios
        .post('/?page=login&action=loginapi',
          `code=${code}`, { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {
            loginer.getUserData();

            setPageMessage('Login successful, redirecting...');
            setTimeout(() => {
              navigate('/');
            }, 3000);
          } //
          else {
            if (!loginer.logged) {
              setPageMessage('Error contacting 42 API');
            }
          }
        })
        .catch(() => {
          if (!loginer.logged) {
            setPageMessage('Error contacting 42 API');
          }
        });
    } //
    else if (code == null) {
      if (!loginer.logged) {
        setPageMessage('Error missing infos for 42 API');
      }
    }
  }, []);

  return (
    <>
      <div className="mt-3 h-6 text-center text-sm">{pageMessage}</div>
    </>
  );
}
