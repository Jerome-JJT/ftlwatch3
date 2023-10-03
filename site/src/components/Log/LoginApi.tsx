import React from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLogin } from 'Hooks/LoginProvider';
import { useNotification } from 'Notifications/NotificationsProvider';

export default function LoginApi (): JSX.Element {
  const { isLogged, getUserData } = useLogin();
  const { addNotif } = useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [pageMessage, setPageMessage] = React.useState('42 api loading');

  const code = searchParams.get('code');

  React.useEffect(() => {
    if (code !== null) {
      axios
        .post('/?page=login&action=loginapi',
          `code=${code}`, { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {
            getUserData(true);

            setPageMessage('Login successful, redirecting...');
            setTimeout(() => {
              navigate('/');
            }, 3000);
          } //
          else {
            if (!isLogged) {
              setPageMessage('Error contacting 42 API');
            }
          }
        })
        .catch((e) => {
          console.log(e)
          if (!isLogged) {
            setPageMessage('Error contacting 42 API');
          }
        });
    } //
    else if (code == null) {
      if (!isLogged) {
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
