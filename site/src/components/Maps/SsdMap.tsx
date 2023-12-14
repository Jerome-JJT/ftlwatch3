import React from 'react';
import { MapPlace } from './MapPlace';
import { MapProps } from './MapProps';



export default function SsdMap({ id, deco, defaultColor }: MapProps) {

  React.useEffect(() => {

    deco?.forEach((val: MapPlace) => {
      const rectElement = document.querySelector(`rect#${id}-${val.id}`);
      const imageElement = document.querySelector(`image#${id}-${val.id}`);

      if (rectElement !== null && imageElement !== null) {
        if (val.color) {
          rectElement.setAttribute('fill', val.color);
        }
        else if (defaultColor) {
          rectElement.setAttribute('fill', defaultColor);
        }
        if (val.image) {
          imageElement.setAttribute('xlink:href', val.image);
        }
        if (val.text && imageElement.nextElementSibling) {
          imageElement.nextElementSibling.textContent = val.text;
        }
      }
    });

  }, [deco, defaultColor, id]);


  return (
    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <g id="row1-0">
        <rect id={`${id}-c3r1s5`} height="20" width="16" y="40" x="60" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r1s5`} height="20" width="16" y="40" x="60" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="72" x="63.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c3r1s4`} height="20" width="16" y="24" x="76" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r1s4`} height="20" width="16" y="24" x="76" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="56" x="79.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c3r1s3`} height="20" width="16" y="40" x="92" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r1s3`} height="20" width="16" y="40" x="92" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="72" x="95.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c3r1s2`} height="20" width="16" y="24" x="108" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r1s2`} height="20" width="16" y="24" x="108" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="56" x="111.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c3r1s1`} height="20" width="16" y="40" x="124" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r1s1`} height="20" width="16" y="40" x="124" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="72" x="127.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="144" y="52" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text1">R1</text></g>
      <g id="row2-0">
        <rect id={`${id}-c3r2s5`} height="20" width="16" y="100" x="60" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r2s5`} height="20" width="16" y="100" x="60" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="132" x="63.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c3r2s4`} height="20" width="16" y="84" x="76" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r2s4`} height="20" width="16" y="84" x="76" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="116" x="79.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c3r2s3`} height="20" width="16" y="100" x="92" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r2s3`} height="20" width="16" y="100" x="92" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="132" x="95.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c3r2s2`} height="20" width="16" y="84" x="108" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r2s2`} height="20" width="16" y="84" x="108" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="116" x="111.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c3r2s1`} height="20" width="16" y="100" x="124" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r2s1`} height="20" width="16" y="100" x="124" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="132" x="127.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="144" y="112" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text2">R2</text></g>
      <g id="row3-0">
        <rect id={`${id}-c3r3s5`} height="20" width="16" y="160" x="60" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r3s5`} height="20" width="16" y="160" x="60" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="192" x="63.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c3r3s4`} height="20" width="16" y="144" x="76" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r3s4`} height="20" width="16" y="144" x="76" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="176" x="79.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c3r3s3`} height="20" width="16" y="160" x="92" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r3s3`} height="20" width="16" y="160" x="92" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="192" x="95.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c3r3s2`} height="20" width="16" y="144" x="108" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r3s2`} height="20" width="16" y="144" x="108" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="176" x="111.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c3r3s1`} height="20" width="16" y="160" x="124" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r3s1`} height="20" width="16" y="160" x="124" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="192" x="127.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="144" y="172" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text3">R3</text></g>
      <g id="row4-0">
        <rect id={`${id}-c3r4s5`} height="20" width="16" y="220" x="60" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r4s5`} height="20" width="16" y="220" x="60" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="252" x="63.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c3r4s4`} height="20" width="16" y="204" x="76" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r4s4`} height="20" width="16" y="204" x="76" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="236" x="79.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c3r4s3`} height="20" width="16" y="220" x="92" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r4s3`} height="20" width="16" y="220" x="92" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="252" x="95.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c3r4s2`} height="20" width="16" y="204" x="108" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r4s2`} height="20" width="16" y="204" x="108" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="236" x="111.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c3r4s1`} height="20" width="16" y="220" x="124" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r4s1`} height="20" width="16" y="220" x="124" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="252" x="127.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="144" y="232" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text4">R4</text></g>
      <g id="row5-0">
        <rect id={`${id}-c3r5s5`} height="20" width="16" y="280" x="60" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r5s5`} height="20" width="16" y="280" x="60" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="312" x="63.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c3r5s4`} height="20" width="16" y="264" x="76" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r5s4`} height="20" width="16" y="264" x="76" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="296" x="79.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c3r5s3`} height="20" width="16" y="280" x="92" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r5s3`} height="20" width="16" y="280" x="92" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="312" x="95.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c3r5s2`} height="20" width="16" y="264" x="108" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r5s2`} height="20" width="16" y="264" x="108" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="296" x="111.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c3r5s1`} height="20" width="16" y="280" x="124" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r5s1`} height="20" width="16" y="280" x="124" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="312" x="127.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="144" y="292" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text5">R5</text></g>
      <g id="row6-0">
        <rect id={`${id}-c3r6s5`} height="20" width="16" y="340" x="60" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r6s5`} height="20" width="16" y="340" x="60" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="372" x="63.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c3r6s4`} height="20" width="16" y="324" x="76" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r6s4`} height="20" width="16" y="324" x="76" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="356" x="79.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c3r6s3`} height="20" width="16" y="340" x="92" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r6s3`} height="20" width="16" y="340" x="92" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="372" x="95.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c3r6s2`} height="20" width="16" y="324" x="108" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r6s2`} height="20" width="16" y="324" x="108" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="356" x="111.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c3r6s1`} height="20" width="16" y="340" x="124" stroke="#7f7f7f" fill="#e5e5e5"/>
        <image id={`${id}-c3r6s1`} height="20" width="16" y="340" x="124" preserveAspectRatio="xMidYMid slice" xlinkHref=""/>
        <text y="372" x="127.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="144" y="352" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text6">R6</text></g>
    </svg>
  );
}
