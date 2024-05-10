import AppLogo from '../../assets/logo_transparent_small.png';
import { Card, CardBody } from '@material-tailwind/react';
import { commonTitle } from 'Utils/commonTitle';
import React from 'react';

export default function AboutPage(): JSX.Element {

  const logos = [
    'adminer.png',
    'github.png',
    'networkx.png',
    'php.png',
    'postgresql.png',
    'rabbitmq.png',
    'tailwindcss.png',
    'docker.png',
    'html.png',
    'nginx.png',
    'plotly.png',
    'python.png',
    'react.png',
    'yarn.png',
  ];


  React.useEffect(() => {document.title = commonTitle('Home');}, []);

  return (

    <div className='flex justify-center'>
      <div className='flex flex-col'>
        <Card className="big-card mx-2 mt-6 max-w-[1200px] shadow-none">
          <CardBody className=''>
            <div className='flex flex-row justify-center items-center gap-4'>
              <img src={AppLogo}
                className="h-12 flip-horizontal"
              />
              <p className='text-center text-3xl text-black dark:text-white tracking-wide font-extrabold'>
                About
              </p>
              <img src={AppLogo}
                className="h-12"
              />
            </div>

            <p className="my-6 text-center">
              Everything used for to this website
            </p>

            <div className='flex flex-row flex-wrap justify-around gap-4'>
              {logos.map((logo) => {
                return <img key={logo} src={`/static/stack/${logo}`} className='max-h-32 max-w-32'/>;
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
