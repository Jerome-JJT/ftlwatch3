import AppLogo from '../../assets/logo_transparent_small.png';
import { Button, Card, CardBody, CardFooter } from '@material-tailwind/react';
import { useLogin } from 'Hooks/LoginProvider';
import { commonTitle } from 'Utils/commonTitle';
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage(): JSX.Element {

  const { isLogged } = useLogin();

  React.useEffect(() => {document.title = commonTitle('Home');}, []);

  return (

    <div className='flex justify-center'>
      <Card className="mt-6 max-w-[600px] dark:bg-gray-600">

        <CardBody className=''>
          <div className='flex flex-row justify-center items-center gap-4'>
            <img src={AppLogo} className="h-12 flip-horizontal" />
            <p className='text-center text-3xl text-black dark:text-white tracking-wide font-extrabold'>
              Page not found
            </p>
            <img src={AppLogo} className="h-12" />
          </div>

          <p className="my-2">
            This page cannot be found
          </p>

          {!isLogged &&
            <p>
              Maybe it&apos;s because you aren&apos;t <a href="/api/?page=login&action=authorizeapi">logged</a> ?
            </p>
          }
          <p className="my-2">
            The code is open source, so feel free to create the page.
          </p>
        </CardBody>

        <CardFooter className="pt-0 flex gap-2">
          {
            !isLogged &&
            <a href={'/api/?page=login&action=authorizeapi'}>
              <Button color='blue'>Sign in</Button>
            </a>
          }

          <Link to={'https://github.com/Jerome-JJT/ftlwatch3'}>
            <Button color='deep-purple'>Github</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
