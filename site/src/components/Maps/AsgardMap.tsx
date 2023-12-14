import React from 'react';
import { MapPlace } from './MapPlace';
import { MapProps } from './MapProps';



export default function AsgardMap({ id, deco, defaultColor }: MapProps) {

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
      <g id="row9-0">
        <rect id={`${id}-c2r9s10`} height="20" width="16" y="80" x="60" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r9s10`} height="20" width="16" y="80" x="60" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="76.8" x="63.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">10</text>
        <rect id={`${id}-c2r9s9`} height="20" width="16" y="100" x="44" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r9s9`} height="20" width="16" y="100" x="44" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="96.8" x="47.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">9</text>
        <rect id={`${id}-c2r9s8`} height="20" width="16" y="120" x="60" stroke="#7f7f7f" fill="#e5e5e5" className="used"></rect>
        <image id={`${id}-c2r9s8`} height="20" width="16" y="120" x="60" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="116.8" x="63.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">8</text>
        <rect id={`${id}-c2r9s7`} height="20" width="16" y="140" x="44" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r9s7`} height="20" width="16" y="140" x="44" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="136.8" x="47.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text>
        <rect id={`${id}-c2r9s6`} height="20" width="16" y="160" x="60" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r9s6`} height="20" width="16" y="160" x="60" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="156.8" x="63.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text> <text fill="#000000" x="44" y="200" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text9">R9</text></g>
      <g id="row9-1">
        <rect id={`${id}-c2r9s5`} height="20" width="16" y="280" x="44" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r9s5`} height="20" width="16" y="280" x="44" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="276.8" x="47.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c2r9s4`} height="20" width="16" y="300" x="28" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r9s4`} height="20" width="16" y="300" x="28" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="296.8" x="31.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c2r9s3`} height="20" width="16" y="320" x="44" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r9s3`} height="20" width="16" y="320" x="44" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="316.8" x="47.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c2r9s2`} height="20" width="16" y="340" x="28" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r9s2`} height="20" width="16" y="340" x="28" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="336.8" x="31.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c2r9s1`} height="20" width="16" y="360" x="44" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r9s1`} height="20" width="16" y="360" x="44" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="356.8" x="47.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="28" y="400" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text9">R9</text></g>
      <g id="row8-0">
        <rect id={`${id}-c2r8s10`} height="20" width="16" y="80" x="120" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r8s10`} height="20" width="16" y="80" x="120" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="76.8" x="123.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">10</text>
        <rect id={`${id}-c2r8s9`} height="20" width="16" y="100" x="104" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r8s9`} height="20" width="16" y="100" x="104" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="96.8" x="107.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">9</text>
        <rect id={`${id}-c2r8s8`} height="20" width="16" y="120" x="120" stroke="#7f7f7f" fill="#e5e5e5" className="used"></rect>
        <image id={`${id}-c2r8s8`} height="20" width="16" y="120" x="120" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="116.8" x="123.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">8</text>
        <rect id={`${id}-c2r8s7`} height="20" width="16" y="140" x="104" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r8s7`} height="20" width="16" y="140" x="104" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="136.8" x="107.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text>
        <rect id={`${id}-c2r8s6`} height="20" width="16" y="160" x="120" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r8s6`} height="20" width="16" y="160" x="120" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="156.8" x="123.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text> <text fill="#000000" x="104" y="200" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text8">R8</text></g>
      <g id="row8-1">
        <rect id={`${id}-c2r8s5`} height="20" width="16" y="280" x="104" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r8s5`} height="20" width="16" y="280" x="104" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="276.8" x="107.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c2r8s4`} height="20" width="16" y="300" x="88" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r8s4`} height="20" width="16" y="300" x="88" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="296.8" x="91.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c2r8s3`} height="20" width="16" y="320" x="104" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r8s3`} height="20" width="16" y="320" x="104" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="316.8" x="107.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c2r8s2`} height="20" width="16" y="340" x="88" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r8s2`} height="20" width="16" y="340" x="88" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="336.8" x="91.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c2r8s1`} height="20" width="16" y="360" x="104" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r8s1`} height="20" width="16" y="360" x="104" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="356.8" x="107.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="88" y="400" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text8">R8</text></g>
      <g id="row7-0">
        <rect id={`${id}-c2r7s10`} height="20" width="16" y="80" x="180" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r7s10`} height="20" width="16" y="80" x="180" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="76.8" x="183.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">10</text>
        <rect id={`${id}-c2r7s9`} height="20" width="16" y="100" x="164" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r7s9`} height="20" width="16" y="100" x="164" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="96.8" x="167.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">9</text>
        <rect id={`${id}-c2r7s8`} height="20" width="16" y="120" x="180" stroke="#7f7f7f" fill="#e5e5e5" className="used"></rect>
        <image id={`${id}-c2r7s8`} height="20" width="16" y="120" x="180" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="116.8" x="183.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">8</text>
        <rect id={`${id}-c2r7s7`} height="20" width="16" y="140" x="164" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r7s7`} height="20" width="16" y="140" x="164" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="136.8" x="167.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text>
        <rect id={`${id}-c2r7s6`} height="20" width="16" y="160" x="180" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r7s6`} height="20" width="16" y="160" x="180" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="156.8" x="183.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text> <text fill="#000000" x="164" y="200" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text7">R7</text></g>
      <g id="row7-1">
        <rect id={`${id}-c2r7s5`} height="20" width="16" y="280" x="164" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r7s5`} height="20" width="16" y="280" x="164" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="276.8" x="167.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c2r7s4`} height="20" width="16" y="300" x="148" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r7s4`} height="20" width="16" y="300" x="148" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="296.8" x="151.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c2r7s3`} height="20" width="16" y="320" x="164" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r7s3`} height="20" width="16" y="320" x="164" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="316.8" x="167.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c2r7s2`} height="20" width="16" y="340" x="148" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r7s2`} height="20" width="16" y="340" x="148" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="336.8" x="151.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c2r7s1`} height="20" width="16" y="360" x="164" stroke="#7f7f7f" fill="#e5e5e5" className="used"></rect>
        <image id={`${id}-c2r7s1`} height="20" width="16" y="360" x="164" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="356.8" x="167.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="148" y="400" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text7">R7</text></g>

      <g id="row6-1">
        <rect id={`${id}-c2r6s5`} height="20" width="16" y="280" x="224" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r6s5`} height="20" width="16" y="280" x="224" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="276.8" x="227.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c2r6s4`} height="20" width="16" y="300" x="208" stroke="#7f7f7f" fill="#e5e5e5" className="used"></rect>
        <image id={`${id}-c2r6s4`} height="20" width="16" y="300" x="208" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="296.8" x="211.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c2r6s3`} height="20" width="16" y="320" x="224" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r6s3`} height="20" width="16" y="320" x="224" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="316.8" x="227.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c2r6s2`} height="20" width="16" y="340" x="208" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r6s2`} height="20" width="16" y="340" x="208" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="336.8" x="211.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c2r6s1`} height="20" width="16" y="360" x="224" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r6s1`} height="20" width="16" y="360" x="224" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="356.8" x="227.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="208" y="400" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text6">R6</text></g>
      <g id="row5-0">
        <rect id={`${id}-c2r5s10`} height="20" width="16" y="80" x="300" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r5s10`} height="20" width="16" y="80" x="300" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="76.8" x="303.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">10</text>
        <rect id={`${id}-c2r5s9`} height="20" width="16" y="100" x="284" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r5s9`} height="20" width="16" y="100" x="284" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="96.8" x="287.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">9</text>
        <rect id={`${id}-c2r5s8`} height="20" width="16" y="120" x="300" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r5s8`} height="20" width="16" y="120" x="300" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="116.8" x="303.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">8</text>
        <rect id={`${id}-c2r5s7`} height="20" width="16" y="140" x="284" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r5s7`} height="20" width="16" y="140" x="284" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="136.8" x="287.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text>
        <rect id={`${id}-c2r5s6`} height="20" width="16" y="160" x="300" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r5s6`} height="20" width="16" y="160" x="300" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="156.8" x="303.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text> <text fill="#000000" x="284" y="200" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text5">R5</text></g>
      <g id="row5-1">
        <rect id={`${id}-c2r5s5`} height="20" width="16" y="280" x="284" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r5s5`} height="20" width="16" y="280" x="284" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="276.8" x="287.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c2r5s4`} height="20" width="16" y="300" x="268" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r5s4`} height="20" width="16" y="300" x="268" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="296.8" x="271.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c2r5s3`} height="20" width="16" y="320" x="284" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r5s3`} height="20" width="16" y="320" x="284" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="316.8" x="287.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c2r5s2`} height="20" width="16" y="340" x="268" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r5s2`} height="20" width="16" y="340" x="268" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="336.8" x="271.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c2r5s1`} height="20" width="16" y="360" x="284" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r5s1`} height="20" width="16" y="360" x="284" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="356.8" x="287.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="268" y="400" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text5">R5</text></g>

      <g id="row4-1">
        <rect id={`${id}-c2r4s5`} height="20" width="16" y="280" x="344" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r4s5`} height="20" width="16" y="280" x="344" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="276.8" x="347.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c2r4s4`} height="20" width="16" y="300" x="328" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r4s4`} height="20" width="16" y="300" x="328" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="296.8" x="331.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c2r4s3`} height="20" width="16" y="320" x="344" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r4s3`} height="20" width="16" y="320" x="344" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="316.8" x="347.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c2r4s2`} height="20" width="16" y="340" x="328" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r4s2`} height="20" width="16" y="340" x="328" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="336.8" x="331.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c2r4s1`} height="20" width="16" y="360" x="344" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r4s1`} height="20" width="16" y="360" x="344" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="356.8" x="347.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="328" y="400" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text4">R4</text></g>
      <g id="row1-0">
        <rect id={`${id}-c2r1s7`} height="20" width="16" y="180" x="420" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r1s7`} height="20" width="16" y="180" x="420" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="212" x="423.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text>
        <rect id={`${id}-c2r1s6`} height="20" width="16" y="164" x="436" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r1s6`} height="20" width="16" y="164" x="436" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="196" x="439.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text>
        <rect id={`${id}-c2r1s5`} height="20" width="16" y="180" x="452" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r1s5`} height="20" width="16" y="180" x="452" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="212" x="455.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c2r1s4`} height="20" width="16" y="164" x="468" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r1s4`} height="20" width="16" y="164" x="468" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="196" x="471.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c2r1s3`} height="20" width="16" y="180" x="484" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r1s3`} height="20" width="16" y="180" x="484" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="212" x="487.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c2r1s2`} height="20" width="16" y="164" x="500" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r1s2`} height="20" width="16" y="164" x="500" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="196" x="503.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c2r1s1`} height="20" width="16" y="180" x="516" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r1s1`} height="20" width="16" y="180" x="516" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="212" x="519.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="536" y="192" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text1">R1</text></g>
      <g id="row2-0">
        <rect id={`${id}-c2r2s7`} height="20" width="16" y="240" x="420" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r2s7`} height="20" width="16" y="240" x="420" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="272" x="423.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text>
        <rect id={`${id}-c2r2s6`} height="20" width="16" y="224" x="436" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r2s6`} height="20" width="16" y="224" x="436" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="256" x="439.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text>
        <rect id={`${id}-c2r2s5`} height="20" width="16" y="240" x="452" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r2s5`} height="20" width="16" y="240" x="452" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="272" x="455.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c2r2s4`} height="20" width="16" y="224" x="468" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r2s4`} height="20" width="16" y="224" x="468" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="256" x="471.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c2r2s3`} height="20" width="16" y="240" x="484" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r2s3`} height="20" width="16" y="240" x="484" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="272" x="487.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c2r2s2`} height="20" width="16" y="224" x="500" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r2s2`} height="20" width="16" y="224" x="500" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="256" x="503.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c2r2s1`} height="20" width="16" y="240" x="516" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r2s1`} height="20" width="16" y="240" x="516" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="272" x="519.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="536" y="252" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text2">R2</text></g>
      <g id="row3-0">
        <rect id={`${id}-c2r3s7`} height="20" width="16" y="300" x="420" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r3s7`} height="20" width="16" y="300" x="420" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="332" x="423.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">7</text>
        <rect id={`${id}-c2r3s6`} height="20" width="16" y="284" x="436" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r3s6`} height="20" width="16" y="284" x="436" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="316" x="439.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">6</text>
        <rect id={`${id}-c2r3s5`} height="20" width="16" y="300" x="452" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r3s5`} height="20" width="16" y="300" x="452" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="332" x="455.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">5</text>
        <rect id={`${id}-c2r3s4`} height="20" width="16" y="284" x="468" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r3s4`} height="20" width="16" y="284" x="468" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="316" x="471.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">4</text>
        <rect id={`${id}-c2r3s3`} height="20" width="16" y="300" x="484" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r3s3`} height="20" width="16" y="300" x="484" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="332" x="487.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">3</text>
        <rect id={`${id}-c2r3s2`} height="20" width="16" y="284" x="500" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r3s2`} height="20" width="16" y="284" x="500" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="316" x="503.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">2</text>
        <rect id={`${id}-c2r3s1`} height="20" width="16" y="300" x="516" stroke="#7f7f7f" fill="#e5e5e5"></rect>
        <image id={`${id}-c2r3s1`} height="20" width="16" y="300" x="516" preserveAspectRatio="xMidYMid slice" xlinkHref=""></image>
        <text y="332" x="519.2" xmlSpace="preserve" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#000000">1</text> <text fill="#000000" x="536" y="312" fontSize="20" fontFamily="Helvetica, Arial, sans-serif" xmlSpace="preserve" fontWeight="bold" id="text3">R3</text></g>
    </svg>
  );
}
