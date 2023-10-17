import React, { type SyntheticEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLogin } from 'Hooks/LoginProvider';
import { useNotification } from 'Notifications/NotificationsProvider';
import { commonTitle } from 'Utils/commonTitle';
import { Button, Card, Checkbox, Input } from '@material-tailwind/react';
import MySelect from 'Common/MySelect';
import { AiFillAccountBook } from 'react-icons/ai';

export function SettingsPage(): JSX.Element {
  const { getUserData } = useLogin();
  const { addNotif } = useNotification();

  const [pageMessage, setPageMessage] = React.useState('');

  const [login, setLogin] = React.useState('');
  const [password, setPassword] = React.useState('');

  const navigate = useNavigate();

  // React.useEffect(() => {document.title = commonTitle('Login');}, []);

  // const handleSubmit = (event: SyntheticEvent): void => {
  //   event.preventDefault();

  //   axios
  //     .post('/?page=login&action=login',
  //       `login=${login}&password=${password}`, { withCredentials: true }
  //     )
  //     .then((res) => {
  //       if (res.status === 200) {
  //         getUserData();
  //         addNotif(`Welcome ${res.data.user.login}!`, 'success');
  //         setPageMessage('Login successful, redirecting...');
  //         setTimeout(() => {
  //           navigate('/');
  //         }, 3000);
  //       } //
  //       else {
  //         setPageMessage('Login error');
  //       }
  //     })
  //     .catch(() => { setPageMessage('Login error'); });
  //   // }
  // };

  return (
    <div className='my-content flex justify-center'>

      <Card className='big-card px-8 py-4 max-w-screen-lg' shadow={false}>
        <p>
        Sign Up
        </p>
        <p className="mt-1 font-normal">
        Enter your details to register.
        </p>
        <form className="">
          <div className="mb-4 flex flex-col gap-6">
            <Input size="lg" label="Link github" />

            <div className='flex flex-row gap-2'>
              <div>
                <MySelect label='Theme' className=''>
                  <option>Color</option>
                  <option>Animals</option>
                  <option>Cursed</option>
                </MySelect>
              </div>



              <Input type='color'
                size='md'
                label='Color'
                className='fields-special-container'
                labelProps={{ className: ' fields-special-label' }}
                containerProps={{ className: '!min-w-[80px]' }}
              />

            </div>

            <Input size="lg" label="Email"
              className='super-field-border super-field-label'
              labelProps={{ className: 'super-field-border super-field-label' }} />
            <Input type="password" size="lg" label="Password" />
          </div>
          <Checkbox
            label={
              <p
                color="gray"
                className="flex items-center font-normal"
              >
              I agree the
                <a
                  className="font-medium transition-colors hover:text-gray-900"
                >
                &nbsp;Terms and Conditions
                </a>
              </p>
            }
            containerProps={{ className: '-ml-2.5' }}
          />
          <Button className="mt-6" fullWidth>
          Register
          </Button>
          <p color="gray" className="mt-4 text-center font-normal">
          Already have an account?{' '}
            <a href="#" className="font-medium text-gray-900">
            Sign In
            </a>
          </p>
        </form>
      </Card>
    </div>

  // <div className="mt-6 flex justify-center">
  //   <form onSubmit={(e) => { }} className="w-98 center justify-center border border-gray-500 bg-gray-200 py-2 pt-10 shadow-lg">
  //     <div className="content sm:w-98 lg:w-98 center mh-8 w-full content-center items-center justify-center text-center">
  //       <>
  //         <div className="center mb-6 flex w-80 content-center justify-center px-6 text-center">
  //           <label className="text-sl block w-2/5 pr-4 text-right font-medium text-gray-900 dark:text-gray-800">
  //             Login name
  //           </label>
  //           <input
  //             id="loginName"
  //             className="block w-3/5 rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:focus:border-blue-500 dark:focus:ring-blue-500"
  //             type="text"
  //             value={login}
  //             onChange={(e) => { setLogin(e.target.value); }}
  //             required
  //           />
  //         </div>

  //         <div className="center mb-6 flex w-80 content-center justify-center px-6 text-center">
  //           <label className="text-sl block w-2/5 pr-4 text-right font-medium text-gray-900 dark:text-gray-800">
  //             Password
  //           </label>
  //           <input
  //             id="password"
  //             className="block w-3/5 rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
  //             type="password"
  //             value={password}
  //             onChange={(e) => { setPassword(e.target.value); }}
  //             required
  //           />
  //         </div>

  //         <button
  //           className="center content-center rounded-lg bg-blue-700 px-5 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:w-auto"
  //         >
  //           Login
  //         </button>
  //       </>

  //       <div className="mt-3 h-6 text-center text-sm">{pageMessage}</div>
  //     </div>
  //   </form>
  // </div>
  );
}
