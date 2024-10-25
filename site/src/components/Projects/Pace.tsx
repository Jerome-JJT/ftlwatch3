import { Fragment, useState } from 'react';
import styled from 'styled-components';

const StyledPace = styled.div`
  .mybox, .box, .table, input {
    background-color: rgb(255 255 255 / 0.9);
  }
`;

const baseUpgrades = [
  [8, 13, 18, 24, 30, 45],
  [32, 48, 60, 72, 88, 118],
  [54, 81, 101, 121, 148, 178],
  [90, 134, 168, 201, 246, 306],
  [141, 211, 264, 316, 387, 447],
  [212, 318, 398, 478, 584, 644],
  [244, 365, 457, 548, 670, 730],
];
const timings = [8, 12, 15, 18, 22, 24];

const addDays = (date: Date, days: number) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
};

export function PacePage(): JSX.Element {
  const [ beginDate, setBeginDate ] = useState('2023-01-01');
  const [ beginDateError, setBeginDateError ] = useState(false);
  const [ offset, setOffset ] = useState(0);

  return (
    <StyledPace>
      <section className="section">
        <link rel="stylesheet" type="text/css" href="static/calc/calculator.css" />
        <link rel="stylesheet" href="static/calc/bulma-rtl.min.css" />

        <div className="box">
          <h1 style={{ textAlign: 'center' }} className="title">
            Pace Calculator
            <p style={{ color: 'black', fontSize: 'x-small' }}>Values not guaranteed to be 100% accurate</p>
          </h1>
        </div>
        <div className='mybox rounded-md p-4'>
          <div className='flex flex-row mb-4 gap-x-6'>
            <div className='py-2'>
              Start date
            </div>
            <input
              className='input !max-w-48'
              style={{ 'border': beginDateError ? '1px solid red' : '' }}
              type='date'
              value={beginDate}
              onChange={(e: any) => {
                if (!isNaN(Date.parse(e.target.value))) {
                  setBeginDate(e.target.value);
                  setBeginDateError(false);
                }
                else {
                  setBeginDateError(true);
                }
              }}
            />
          </div>
          <div className='flex flex-row mb-4 gap-x-6'>
            <div className='py-2'>
              Offset days
            </div>
            <input
              className='input !max-w-28'
              type='number'
              min={0}
              max={365}
              value={offset}
              onChange={(e: any) => {
                setOffset(parseInt(e.target.value || 0));
              }}
            />
          </div>

          <div className='grid grid-cols-7 gap-2'>
            <div key={'h-x'} className='border-b border-black'>X</div>
            {timings.map((t) => {
              return <div key={`h-${t}`} className='border-b border-black'>Pace {t}</div>;
            })}

            {[0, 1, 2, 3, 4, 5, 6].map((c) => {
              return (
                <Fragment key={`l-${c}`}>
                  <div key={`${c}-x`}>Circle {c}</div>
                  {timings.map((t, p) => {
                    const addition = baseUpgrades[c][p];
                    const res = addDays(new Date(beginDate), Math.floor(addition + offset - 1));
                    return <div key={`${c}-${t}`}>
                      {res.toISOString().substring(0, 10)}
                    </div>;
                  })}
                </Fragment>
              );
            })}
          </div>
        </div>
      </section>
    </StyledPace>
  );
}
