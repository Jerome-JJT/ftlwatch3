import React from 'react';
import { type UseLoginDto } from '../Hooks/useLogin';
import PlaceStyled from './PlaceStyled';

interface PlaceProps {
  loginer: UseLoginDto
}

export default function Place ({
  loginer
}: PlaceProps): JSX.Element {
  const colors = [
    'c-ffffff',
    'c-e4e4e4',
    'c-888888',
    'c-222222',
    'c-ffa7d1',
    'c-e50000',
    'c-e59500',
    'c-a06a42',
    'c-e5d900',
    'c-94e044',
    'c-02be01',
    'c-00d3dd',
    'c-0083c7',
    'c-0000ea',
    'c-cf6ee4',
    'c-820080'
  ]

  React.useEffect(() => {

  }, [])

  //
  return (
    <PlaceStyled>

      <div id="canvas"></div>
      <div className="controls">
        <a id="auth">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300.00006 244.18703" height="30" width="30" version="1.1">
            <g transform="translate(-539.18 -568.86)">
              <path d="m633.9 812.04c112.46 0 173.96-93.168 173.96-173.96 0-2.6463-0.0539-5.2806-0.1726-7.903 11.938-8.6302 22.314-19.4 30.498-31.66-10.955 4.8694-22.744 8.1474-35.111 9.6255 12.623-7.5693 22.314-19.543 26.886-33.817-11.813 7.0031-24.895 12.093-38.824 14.841-11.157-11.884-27.041-19.317-44.629-19.317-33.764 0-61.144 27.381-61.144 61.132 0 4.7978 0.5364 9.4646 1.5854 13.941-50.815-2.5569-95.874-26.886-126.03-63.88-5.2508 9.0354-8.2785 19.531-8.2785 30.73 0 21.212 10.794 39.938 27.208 50.893-10.031-0.30992-19.454-3.0635-27.69-7.6468-0.009 0.25652-0.009 0.50661-0.009 0.78077 0 29.61 21.075 54.332 49.051 59.934-5.1376 1.4006-10.543 2.1516-16.122 2.1516-3.9336 0-7.766-0.38716-11.491-1.1026 7.7838 24.293 30.355 41.971 57.115 42.465-20.926 16.402-47.287 26.171-75.937 26.171-4.929 0-9.7983-0.28036-14.584-0.84634 27.059 17.344 59.189 27.464 93.722 27.464" fill="#ffffff" />
            </g>
          </svg>
          <span id="authButtonText">Login</span>
        </a>
        <ul id="colors">

          {
            colors.map((color, id) => {
              return (<li key={id} className="" id={`${color}`} ></li>)
            })
          }

          <div className="cooldown">
            <span id="cooldown-text">1:00</span>
          </div>
        </ul>
        <div className="face-space"></div>
      </div>

      <div className="info general">Click to zoom, click and drag to move.</div>
      <div className="info drawing">Click to draw pixel, click and drag to move.</div>
      <div className="info loading">Loading...</div>

      <div className="zoom-controls">
        <div id="zoom-in">+</div>
        <div id="zoom-out">-</div>
      </div>
    </PlaceStyled>
  );
}
