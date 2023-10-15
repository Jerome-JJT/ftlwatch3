import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from 'Hooks/LoginProvider';
import { commonTitle } from 'Utils/commonTitle';

export default function Logout(): JSX.Element {
  const { logout } = useLogin();
  const navigate = useNavigate();
  const [pageMessage, setPageMessage] = React.useState('Logout');

  React.useEffect(() => {document.title = commonTitle('Logout');}, []);

  React.useEffect(() => {
    logout();
    setPageMessage('Logout successful, redirecting...');
    // loginer.getUserData();

    setTimeout(() => {
      navigate('/');
    }, 3000);
  }, [logout, navigate]);

  return <><div className="mt-3 h-6 text-center text-sm">{pageMessage}</div></>;
}
