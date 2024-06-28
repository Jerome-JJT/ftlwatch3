import AppLogo from '../../assets/logo_transparent_small.png';
import { Avatar, Button, Card, CardBody, CardFooter } from '@material-tailwind/react';
import { useLogin } from 'Hooks/LoginProvider';
import { commonTitle } from 'Utils/commonTitle';
import { createAuthorizeURL } from 'Utils/createAuthorizeURL';
import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage(): JSX.Element {

  const { isLogged, userInfos } = useLogin();

  React.useEffect(() => {document.title = commonTitle('Home');}, []);

  return (

    <div className='flex justify-center'>
      <div className='flex flex-col'>
        { userInfos?.citation && userInfos?.citation.length > 0 &&

          <Card className="big-card mx-2 mt-6 !mb-0 max-w-[600px] shadow-none">
            <CardBody className='py-2 flex flex-row justify-center gap-6 items-center'>
              { userInfos?.citation_avatar && userInfos?.citation_avatar.length > 0 &&
                <Avatar src={userInfos?.citation_avatar} alt="citator" />
              }
              <p className='text-center text-xl text-black dark:text-white tracking-wide font-extrabold'>
                {userInfos.citation}
              </p>
            </CardBody>
          </Card>
        }

        <Card className="big-card mx-2 mt-6 max-w-[600px] shadow-none">
          <CardBody className=''>
            <div className='flex flex-row justify-center items-center gap-4'>
              <img src={AppLogo}
                className="h-12 flip-horizontal"
              />
              <p className='text-center text-3xl text-black dark:text-white tracking-wide font-extrabold'>
              Welcome to 42lwatch (V3) !
              </p>
              <img src={AppLogo}
                className="h-12"
              />
            </div>

            <p className="my-2">
            The (best) website for everything related to 42Lausanne (student side)
            </p>

            {!isLogged &&
            <p>
              To access most of the pages, you need to be <a href={createAuthorizeURL()}>logged</a> first
            </p>
            }
            <p className="my-2">
            The code is open source, so feel free to leave a pull request on the project if you see any upgrade you want to see
            </p>
          </CardBody>

          <CardFooter className="pt-0 flex gap-2">
            {
              !isLogged &&
          <a href={createAuthorizeURL()}>
            <Button color='blue'>Sign in</Button>
          </a>
            }

            <Link to={'https://github.com/Jerome-JJT/ftlwatch3'}>
              <Button color='deep-purple'>Github</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
