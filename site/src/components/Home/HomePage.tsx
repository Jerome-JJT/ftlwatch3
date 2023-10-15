import { Button, Card, CardBody, CardFooter, CardHeader } from '@material-tailwind/react';
import { useLogin } from 'Hooks/LoginProvider';
import { commonTitle } from 'Utils/commonTitle';
import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage(): JSX.Element {

  const { isLogged } = useLogin();

  React.useEffect(() => {document.title = commonTitle('Home');}, []);

  return (

    <div className='flex justify-center'>
      <Card className="mt-6 max-w-[600px] dark:bg-gray-600">

        <CardBody className=''>
          <p className='text-center text-3xl text-black dark:text-white tracking-wide font-extrabold'>
            Welcome to 42lwatch (V3) !
          </p>

          <p className="my-2">
            The (best) website for everything related to 42Lausanne (student side)
          </p>

          {!isLogged &&
            <p>
              To access most of the pages, you need to be <Link to="loginapi">logged</Link> first
            </p>
          }
          <p className="my-2">
            The code is open source, so feel free to leave a pull request on the project if you see any upgrade you want to see
          </p>
        </CardBody>

        <CardFooter className="pt-0 flex gap-2">
          {/* <Link
  //       to={'https://github.com/Tosba74/ft_transcendance'}
  //       className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  //     >
  //       GitHub
  //     </Link> */}
          <Link to={'/loginapi'}>
            <Button color='blue'>Sign in</Button>
          </Link>

          <Link to={'https://github.com/Jerome-JJT/ftlwatch3'}>
            <Button color='deep-purple'>Github</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>


  //   <div className="inline-flex">
  //     <Link
  //       to={'https://github.com/Tosba74/ft_transcendance'}
  //       className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  //     >
  //       GitHub
  //     </Link>
  //   </div>
  // </div>
  );
}
