import React from 'react';
import { MapPlace } from './MapPlace';
import { MapProps } from './MapProps';



export default function GothamMap({ id, deco, defaultColor = '#e5e5e5' }: MapProps) {

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
    <svg viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <g id="row12-0">
        <rect id={`${id}-c1r12s1`} height="20" width="16" y="80" x="20" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r12s1`} height="20" width="16" y="80" x="20" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="112" x="23.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text>
        <rect id={`${id}-c1r12s2`} height="20" width="16" y="64" x="36" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r12s2`} height="20" width="16" y="64" x="36" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="96" x="39.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c1r12s3`} height="20" width="16" y="80" x="52" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r12s3`} height="20" width="16" y="80" x="52" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="112" x="55.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c1r12s4`} height="20" width="16" y="64" x="68" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r12s4`} height="20" width="16" y="64" x="68" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="96" x="71.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c1r12s5`} height="20" width="16" y="80" x="84" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r12s5`} height="20" width="16" y="80" x="84" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="112" x="87.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c1r12s6`} height="20" width="16" y="64" x="100" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r12s6`} height="20" width="16" y="64" x="100" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="96" x="103.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text>
        <rect id={`${id}-c1r12s7`} height="20" width="16" y="80" x="116" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r12s7`} height="20" width="16" y="80" x="116" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="112" x="119.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text> <text fill="#000000" x="136" y="92" fontSize="20" fontFamily="Futura PT, Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text12">R12</text></g>
      <g id="row13-0">
        <rect id={`${id}-c1r13s1`} height="20" width="16" y="140" x="20" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r13s1`} height="20" width="16" y="140" x="20" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="172" x="23.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text>
        <rect id={`${id}-c1r13s2`} height="20" width="16" y="124" x="36" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r13s2`} height="20" width="16" y="124" x="36" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="156" x="39.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c1r13s3`} height="20" width="16" y="140" x="52" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r13s3`} height="20" width="16" y="140" x="52" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="172" x="55.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c1r13s4`} height="20" width="16" y="124" x="68" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r13s4`} height="20" width="16" y="124" x="68" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="156" x="71.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c1r13s5`} height="20" width="16" y="140" x="84" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r13s5`} height="20" width="16" y="140" x="84" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="172" x="87.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c1r13s6`} height="20" width="16" y="124" x="100" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r13s6`} height="20" width="16" y="124" x="100" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="156" x="103.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text>
        <rect id={`${id}-c1r13s7`} height="20" width="16" y="140" x="116" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r13s7`} height="20" width="16" y="140" x="116" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="172" x="119.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text> <text fill="#000000" x="136" y="152" fontSize="20" fontFamily="Futura PT, Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text13">R13</text></g>
      <g id="row14-0">
        <rect id={`${id}-c1r14s1`} height="20" width="16" y="200" x="20" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r14s1`} height="20" width="16" y="200" x="20" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="232" x="23.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text>
        <rect id={`${id}-c1r14s2`} height="20" width="16" y="184" x="36" stroke="#7f7f7f" fill={`${defaultColor}`} className="used my-location"></rect>
        <image id={`${id}-c1r14s2`} height="20" width="16" y="184" x="36" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="216" x="39.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c1r14s3`} height="20" width="16" y="200" x="52" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r14s3`} height="20" width="16" y="200" x="52" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="232" x="55.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c1r14s4`} height="20" width="16" y="184" x="68" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r14s4`} height="20" width="16" y="184" x="68" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="216" x="71.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c1r14s5`} height="20" width="16" y="200" x="84" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r14s5`} height="20" width="16" y="200" x="84" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="232" x="87.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c1r14s6`} height="20" width="16" y="184" x="100" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r14s6`} height="20" width="16" y="184" x="100" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="216" x="103.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text>
        <rect id={`${id}-c1r14s7`} height="20" width="16" y="200" x="116" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r14s7`} height="20" width="16" y="200" x="116" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="232" x="119.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text> <text fill="#000000" x="136" y="212" fontSize="20" fontFamily="Futura PT, Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text14">R14</text></g>
      <g id="row15-0">
        <rect id={`${id}-c1r15s1`} height="20" width="16" y="260" x="20" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r15s1`} height="20" width="16" y="260" x="20" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="292" x="23.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text>
        <rect id={`${id}-c1r15s2`} height="20" width="16" y="244" x="36" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r15s2`} height="20" width="16" y="244" x="36" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="276" x="39.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c1r15s3`} height="20" width="16" y="260" x="52" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r15s3`} height="20" width="16" y="260" x="52" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="292" x="55.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c1r15s4`} height="20" width="16" y="244" x="68" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r15s4`} height="20" width="16" y="244" x="68" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="276" x="71.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c1r15s5`} height="20" width="16" y="260" x="84" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r15s5`} height="20" width="16" y="260" x="84" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="292" x="87.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c1r15s6`} height="20" width="16" y="244" x="100" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r15s6`} height="20" width="16" y="244" x="100" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="276" x="103.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text>
        <rect id={`${id}-c1r15s7`} height="20" width="16" y="260" x="116" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r15s7`} height="20" width="16" y="260" x="116" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="292" x="119.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text> <text fill="#000000" x="136" y="272" fontSize="20" fontFamily="Futura PT, Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text15">R15</text></g>
      <g id="row16-0">
        <rect id={`${id}-c1r16s1`} height="20" width="16" y="320" x="20" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r16s1`} height="20" width="16" y="320" x="20" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="352" x="23.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text>
        <rect id={`${id}-c1r16s2`} height="20" width="16" y="304" x="36" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r16s2`} height="20" width="16" y="304" x="36" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="336" x="39.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c1r16s3`} height="20" width="16" y="320" x="52" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r16s3`} height="20" width="16" y="320" x="52" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="352" x="55.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c1r16s4`} height="20" width="16" y="304" x="68" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r16s4`} height="20" width="16" y="304" x="68" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="336" x="71.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c1r16s5`} height="20" width="16" y="320" x="84" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r16s5`} height="20" width="16" y="320" x="84" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="352" x="87.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c1r16s6`} height="20" width="16" y="304" x="100" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r16s6`} height="20" width="16" y="304" x="100" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="336" x="103.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text>
        <rect id={`${id}-c1r16s7`} height="20" width="16" y="320" x="116" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r16s7`} height="20" width="16" y="320" x="116" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="352" x="119.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text> <text fill="#000000" x="136" y="332" fontSize="20" fontFamily="Futura PT, Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text16">R16</text></g>
      <g id="row17-0">
        <rect id={`${id}-c1r17s1`} height="20" width="16" y="380" x="20" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r17s1`} height="20" width="16" y="380" x="20" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="412" x="23.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text>
        <rect id={`${id}-c1r17s2`} height="20" width="16" y="364" x="36" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r17s2`} height="20" width="16" y="364" x="36" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="396" x="39.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c1r17s3`} height="20" width="16" y="380" x="52" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r17s3`} height="20" width="16" y="380" x="52" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="412" x="55.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c1r17s4`} height="20" width="16" y="364" x="68" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r17s4`} height="20" width="16" y="364" x="68" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="396" x="71.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c1r17s5`} height="20" width="16" y="380" x="84" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r17s5`} height="20" width="16" y="380" x="84" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="412" x="87.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c1r17s6`} height="20" width="16" y="364" x="100" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r17s6`} height="20" width="16" y="364" x="100" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="396" x="103.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text>
        <rect id={`${id}-c1r17s7`} height="20" width="16" y="380" x="116" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r17s7`} height="20" width="16" y="380" x="116" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="412" x="119.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text> <text fill="#000000" x="136" y="392" fontSize="20" fontFamily="Futura PT, Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text17">R17</text></g>
      <g id="row11-0">
        <rect id={`${id}-c1r11s1`} height="20" width="16" y="80" x="220" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r11s1`} height="20" width="16" y="80" x="220" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="76.8" x="223.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text>
        <rect id={`${id}-c1r11s2`} height="20" width="16" y="100" x="204" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r11s2`} height="20" width="16" y="100" x="204" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="96.8" x="207.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c1r11s3`} height="20" width="16" y="120" x="220" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r11s3`} height="20" width="16" y="120" x="220" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="116.8" x="223.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c1r11s4`} height="20" width="16" y="140" x="204" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r11s4`} height="20" width="16" y="140" x="204" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="136.8" x="207.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c1r11s5`} height="20" width="16" y="160" x="220" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r11s5`} height="20" width="16" y="160" x="220" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="156.8" x="223.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c1r11s6`} height="20" width="16" y="180" x="204" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r11s6`} height="20" width="16" y="180" x="204" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="176.8" x="207.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text>
        <rect id={`${id}-c1r11s7`} height="20" width="16" y="200" x="220" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r11s7`} height="20" width="16" y="200" x="220" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="196.8" x="223.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text>
        <rect id={`${id}-c1r11s8`} height="20" width="16" y="220" x="204" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r11s8`} height="20" width="16" y="220" x="204" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="216.8" x="207.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">8</text> <text fill="#000000" x="204" y="260" fontSize="20" fontFamily="Futura PT, Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text6">R11</text></g>
      <g id="row9-0">
        <rect id={`${id}-c1r9s1`} height="20" width="16" y="80" x="280" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r9s1`} height="20" width="16" y="80" x="280" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="76.8" x="283.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text>
        <rect id={`${id}-c1r9s2`} height="20" width="16" y="100" x="264" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r9s2`} height="20" width="16" y="100" x="264" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="96.8" x="267.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c1r9s3`} height="20" width="16" y="120" x="280" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r9s3`} height="20" width="16" y="120" x="280" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="116.8" x="283.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c1r9s4`} height="20" width="16" y="140" x="264" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r9s4`} height="20" width="16" y="140" x="264" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="136.8" x="267.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c1r9s5`} height="20" width="16" y="160" x="280" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r9s5`} height="20" width="16" y="160" x="280" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="156.8" x="283.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c1r9s6`} height="20" width="16" y="180" x="264" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r9s6`} height="20" width="16" y="180" x="264" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="176.8" x="267.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text>
        <rect id={`${id}-c1r9s7`} height="20" width="16" y="200" x="280" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r9s7`} height="20" width="16" y="200" x="280" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="196.8" x="283.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text>
        <rect id={`${id}-c1r9s8`} height="20" width="16" y="220" x="264" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r9s8`} height="20" width="16" y="220" x="264" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="216.8" x="267.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">8</text> <text fill="#000000" x="264" y="260" fontSize="20" fontFamily="Futura PT, Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text5">R9</text></g>
      <g id="row4-0">
        <rect id={`${id}-c1r7s1`} height="20" width="16" y="80" x="340" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r7s1`} height="20" width="16" y="80" x="340" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="76.8" x="343.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text>
        <rect id={`${id}-c1r7s2`} height="20" width="16" y="100" x="324" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r7s2`} height="20" width="16" y="100" x="324" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="96.8" x="327.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c1r7s3`} height="20" width="16" y="120" x="340" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r7s3`} height="20" width="16" y="120" x="340" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="116.8" x="343.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c1r7s4`} height="20" width="16" y="140" x="324" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r7s4`} height="20" width="16" y="140" x="324" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="136.8" x="327.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c1r7s5`} height="20" width="16" y="160" x="340" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r7s5`} height="20" width="16" y="160" x="340" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="156.8" x="343.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c1r7s6`} height="20" width="16" y="180" x="324" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r7s6`} height="20" width="16" y="180" x="324" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="176.8" x="327.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text>
        <rect id={`${id}-c1r7s7`} height="20" width="16" y="200" x="340" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r7s7`} height="20" width="16" y="200" x="340" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="196.8" x="343.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text>
        <rect id={`${id}-c1r7s8`} height="20" width="16" y="220" x="324" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r7s8`} height="20" width="16" y="220" x="324" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="216.8" x="327.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">8</text> <text fill="#000000" x="324" y="260" fontSize="20" fontFamily="Futura PT, Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text4">R7</text></g>
      <g id="row5-0">
        <rect id={`${id}-c1r5s1`} height="20" width="16" y="80" x="400" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r5s1`} height="20" width="16" y="80" x="400" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="76.8" x="403.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text>
        <rect id={`${id}-c1r5s2`} height="20" width="16" y="100" x="384" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r5s2`} height="20" width="16" y="100" x="384" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="96.8" x="387.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c1r5s3`} height="20" width="16" y="120" x="400" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r5s3`} height="20" width="16" y="120" x="400" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="116.8" x="403.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c1r5s4`} height="20" width="16" y="140" x="384" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r5s4`} height="20" width="16" y="140" x="384" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="136.8" x="387.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c1r5s5`} height="20" width="16" y="160" x="400" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r5s5`} height="20" width="16" y="160" x="400" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="156.8" x="403.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c1r5s6`} height="20" width="16" y="180" x="384" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r5s6`} height="20" width="16" y="180" x="384" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="176.8" x="387.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text>
        <rect id={`${id}-c1r5s7`} height="20" width="16" y="200" x="400" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r5s7`} height="20" width="16" y="200" x="400" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="196.8" x="403.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text>
        <rect id={`${id}-c1r5s8`} height="20" width="16" y="220" x="384" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r5s8`} height="20" width="16" y="220" x="384" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="216.8" x="387.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">8</text> <text fill="#000000" x="384" y="260" fontSize="20" fontFamily="Futura PT, Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text3">R5</text></g>
      <g id="row3-0">
        <rect id={`${id}-c1r3s1`} height="20" width="16" y="80" x="460" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r3s1`} height="20" width="16" y="80" x="460" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="76.8" x="463.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text>
        <rect id={`${id}-c1r3s2`} height="20" width="16" y="100" x="444" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r3s2`} height="20" width="16" y="100" x="444" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="96.8" x="447.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c1r3s3`} height="20" width="16" y="120" x="460" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r3s3`} height="20" width="16" y="120" x="460" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="116.8" x="463.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c1r3s4`} height="20" width="16" y="140" x="444" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r3s4`} height="20" width="16" y="140" x="444" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="136.8" x="447.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c1r3s5`} height="20" width="16" y="160" x="460" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r3s5`} height="20" width="16" y="160" x="460" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="156.8" x="463.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c1r3s6`} height="20" width="16" y="180" x="444" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r3s6`} height="20" width="16" y="180" x="444" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="176.8" x="447.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text>
        <rect id={`${id}-c1r3s7`} height="20" width="16" y="200" x="460" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r3s7`} height="20" width="16" y="200" x="460" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="196.8" x="463.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text>
        <rect id={`${id}-c1r3s8`} height="20" width="16" y="220" x="444" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r3s8`} height="20" width="16" y="220" x="444" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="216.8" x="447.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">8</text> <text fill="#000000" x="444" y="260" fontSize="20" fontFamily="Futura PT, Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text2">R3</text></g>
      <g id="row1-0">
        <rect id={`${id}-c1r1s1`} height="20" width="16" y="80" x="520" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r1s1`} height="20" width="16" y="80" x="520" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="76.8" x="523.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text>
        <rect id={`${id}-c1r1s2`} height="20" width="16" y="100" x="504" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r1s2`} height="20" width="16" y="100" x="504" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="96.8" x="507.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c1r1s3`} height="20" width="16" y="120" x="520" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r1s3`} height="20" width="16" y="120" x="520" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="116.8" x="523.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c1r1s4`} height="20" width="16" y="140" x="504" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r1s4`} height="20" width="16" y="140" x="504" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="136.8" x="507.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c1r1s5`} height="20" width="16" y="160" x="520" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r1s5`} height="20" width="16" y="160" x="520" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="156.8" x="523.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c1r1s6`} height="20" width="16" y="180" x="504" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r1s6`} height="20" width="16" y="180" x="504" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="176.8" x="507.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text>
        <rect id={`${id}-c1r1s7`} height="20" width="16" y="200" x="520" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r1s7`} height="20" width="16" y="200" x="520" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="196.8" x="523.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text>
        <rect id={`${id}-c1r1s8`} height="20" width="16" y="220" x="504" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r1s8`} height="20" width="16" y="220" x="504" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="216.8" x="507.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">8</text> <text fill="#000000" x="504" y="260" fontSize="20" fontFamily="Futura PT, Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text1">R1</text></g>
      <g id="row10-0">
        <rect id={`${id}-c1r10s4`} height="20" width="16" y="300" x="240" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r10s4`} height="20" width="16" y="300" x="240" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="296.8" x="243.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c1r10s3`} height="20" width="16" y="320" x="224" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r10s3`} height="20" width="16" y="320" x="224" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="316.8" x="227.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c1r10s2`} height="20" width="16" y="340" x="240" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r10s2`} height="20" width="16" y="340" x="240" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="336.8" x="243.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c1r10s1`} height="20" width="16" y="360" x="224" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r10s1`} height="20" width="16" y="360" x="224" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="356.8" x="227.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="224" y="400" fontSize="20" fontFamily="Futura PT, Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text7">R10</text></g>
      <g id="row8-0">
        <rect id={`${id}-c1r8s4`} height="20" width="16" y="300" x="300" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r8s4`} height="20" width="16" y="300" x="300" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="296.8" x="303.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c1r8s3`} height="20" width="16" y="320" x="284" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r8s3`} height="20" width="16" y="320" x="284" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="316.8" x="287.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c1r8s2`} height="20" width="16" y="340" x="300" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r8s2`} height="20" width="16" y="340" x="300" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="336.8" x="303.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c1r8s1`} height="20" width="16" y="360" x="284" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r8s1`} height="20" width="16" y="360" x="284" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="356.8" x="287.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="284" y="400" fontSize="20" fontFamily="Futura PT, Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text8">R8</text></g>
      <g id="row6-0">
        <rect id={`${id}-c1r6s4`} height="20" width="16" y="300" x="360" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r6s4`} height="20" width="16" y="300" x="360" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="296.8" x="363.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c1r6s3`} height="20" width="16" y="320" x="344" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r6s3`} height="20" width="16" y="320" x="344" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="316.8" x="347.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c1r6s2`} height="20" width="16" y="340" x="360" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r6s2`} height="20" width="16" y="340" x="360" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="336.8" x="363.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c1r6s1`} height="20" width="16" y="360" x="344" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r6s1`} height="20" width="16" y="360" x="344" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="356.8" x="347.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="344" y="400" fontSize="20" fontFamily="Futura PT, Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text9">R6</text></g>
      <g id="row4-0">
        <rect id={`${id}-c1r4s4`} height="20" width="16" y="300" x="420" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r4s4`} height="20" width="16" y="300" x="420" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="296.8" x="423.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c1r4s3`} height="20" width="16" y="320" x="404" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r4s3`} height="20" width="16" y="320" x="404" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="316.8" x="407.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c1r4s2`} height="20" width="16" y="340" x="420" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r4s2`} height="20" width="16" y="340" x="420" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="336.8" x="423.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c1r4s1`} height="20" width="16" y="360" x="404" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r4s1`} height="20" width="16" y="360" x="404" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="356.8" x="407.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="404" y="400" fontSize="20" fontFamily="Futura PT, Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text10">R4</text></g>
      <g id="row2-0">
        <rect id={`${id}-c1r2s4`} height="20" width="16" y="300" x="480" stroke="#7f7f7f" fill={`${defaultColor}`}></rect>
        <image id={`${id}-c1r2s4`} height="20" width="16" y="300" x="480" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="296.8" x="483.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c1r2s3`} height="20" width="16" y="320" x="464" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r2s3`} height="20" width="16" y="320" x="464" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="316.8" x="467.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c1r2s2`} height="20" width="16" y="340" x="480" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r2s2`} height="20" width="16" y="340" x="480" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="336.8" x="483.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c1r2s1`} height="20" width="16" y="360" x="464" stroke="#7f7f7f" fill={`${defaultColor}`} className="used"></rect>
        <image id={`${id}-c1r2s1`} height="20" width="16" y="360" x="464" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="356.8" x="467.2" xmlSpace="preserve" fontFamily="Futura PT, Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="464" y="400" fontSize="20" fontFamily="Futura PT, Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text11">R2</text></g></svg>
  );
}
