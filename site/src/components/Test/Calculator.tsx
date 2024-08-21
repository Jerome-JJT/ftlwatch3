import axios from 'axios';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import { useNotification } from 'Notifications/NotificationsProvider';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import styled from 'styled-components';

const StyledCalculator = styled.div`
  .box, .table, input {
    background-color: rgb(255 255 255 / 0.9);
  }
`;

interface inputline {
  project: string,
  xp: number,
  note: number,
  bonus: number,
}

interface project {
  name: string,
  xp: number
}

const level_xp = [
  { 'x': 0, 'y': 0 },
  { 'x': 1, 'y': 462 },
  { 'x': 2, 'y': 2688 },
  { 'x': 3, 'y': 5885 },
  { 'x': 4, 'y': 11777 },
  { 'x': 5, 'y': 29217 },
  { 'x': 6, 'y': 46289 },
  { 'x': 7, 'y': 63592 },
  { 'x': 8, 'y': 74373 },
  { 'x': 9, 'y': 85516 },
  { 'x': 10, 'y': 95033 },
  { 'x': 11, 'y': 105630 },
  { 'x': 12, 'y': 124446 },
  { 'x': 13, 'y': 145782 },
  { 'x': 14, 'y': 169932 },
  { 'x': 15, 'y': 197316 },
  { 'x': 16, 'y': 228354 },
  { 'x': 17, 'y': 263508 },
  { 'x': 18, 'y': 303366 },
  { 'x': 19, 'y': 348516 },
  { 'x': 20, 'y': 399672 },
  { 'x': 21, 'y': 457632 },
  { 'x': 22, 'y': 523320 },
  { 'x': 23, 'y': 597786 },
  { 'x': 24, 'y': 682164 },
  { 'x': 25, 'y': 777756 },
  { 'x': 26, 'y': 886074 },
  { 'x': 27, 'y': 1008798 },
  { 'x': 28, 'y': 1147902 },
  { 'x': 29, 'y': 1305486 },
  { 'x': 30, 'y': 1484070 },
];

const calculate_end_level = (current_level: number, project_xp: number, note: number, has_coa_bonus: number) => {
  // Get current_xp
  const level_down = Math.floor(current_level);
  const level_down_xp = level_xp[Math.max(Math.min(level_down, level_xp.length - 1), 0)].y;

  const level_sup = Math.ceil(current_level);
  const level_sup_xp = level_xp[Math.max(Math.min(level_sup, level_xp.length - 1), 0)].y;

  const level_xp_total_current = level_sup_xp - level_down_xp;
  const current_xp = level_down_xp + (level_xp_total_current * (current_level - Math.floor(current_level)));

  // Get project_xp_total
  let project_xp_total = project_xp * (Math.round(note) / 100);
  // const bonus_xp = 0;
  if (has_coa_bonus === 1) {
    project_xp_total = project_xp_total + (project_xp_total * 0.042);
  }

  //Calculate Final Xp.
  let final_xp = current_xp + project_xp_total;
  // Calculate Final level
  let i = 0;
  for (;i < level_xp.length;i++) {
    if (level_xp[i].y > final_xp) {
      break;
    }
  }
  const min_xp = level_xp[Math.max(Math.min(i-1, level_xp.length - 1), 0)].y;
  const max_xp = level_xp[Math.max(Math.min(i, level_xp.length - 1), 0)].y;
  const tmp_max_xp = max_xp - min_xp;
  const tmp_final_xp = final_xp - min_xp;

  const final_level = level_xp[i-1].x + (tmp_final_xp / tmp_max_xp);
  const final_level_txt = final_level.toFixed(2) as never as number;

  let blackholesDays = 0;
  // Calculate Blackholes Days
  if (current_level < 8.41) {
    const xp_final_bh = 78909;
    if (final_xp > xp_final_bh) {
      final_xp = xp_final_bh;
    }
    blackholesDays = (Math.pow((final_xp / xp_final_bh), 0.45) - (Math.pow((current_xp / xp_final_bh), 0.45))) * 593;
  }

  return [final_level_txt, blackholesDays];
};

export default function CalculatorPage(): JSX.Element {
  const { addNotif } = useNotification();
  const [suggestions, setSuggestions] = useState<project[]>([]);
  const [beginLevel, setBeginLevel] = useState<number>(0);
  const initData = {
    project: '',
    xp:      0,
    note:    100,
    bonus:   0,
  };
  const [data, setData] = useState<inputline[]>([initData]);

  const [projects, setProjects] = useState<project[]>([]);


  useEffect(() => {
    axios
      .get('/?page=me&action=calculator_get',
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setProjects(res.data.projects);
          setBeginLevel(res.data.beginLevel);
        }
      })
      .catch((error) => {
        addNotif(AxiosErrorText(error), 'error');
      });
  }, [addNotif]);

  const getSuggestions = useCallback((value: string) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : projects.filter((p) =>
      p.name.toLowerCase().includes(inputValue)
    );
  }, [projects]);

  const getSuggestionValue = (suggestion: project) => suggestion.name;

  const renderSuggestion = (suggestion: project) => (
    <div>
      {suggestion?.name || ''}
    </div>
  );

  const renderLine = useCallback((d: inputline, i: number, begin: number, end: number, blackhole: number) => {
    return (
      <tr key={i}>
        <td>
          <input
            name="current_level"
            type="number"
            value={begin}
            min="0"
            max="30"
            step="0.01"
            className="input"
            style={{ minWidth: '100px' }}
            disabled={i !== 0}
            onChange={(e: any) => {
              setBeginLevel(e.target.value);
            }}
          />
        </td>
        <td>
          <Autosuggest
            id="select_project"
            suggestions={suggestions}
            renderSuggestion={renderSuggestion}
            getSuggestionValue={getSuggestionValue}
            onSuggestionsClearRequested={() => {setSuggestions([]);}}
            onSuggestionsFetchRequested={({ value }) => {setSuggestions(getSuggestions(value));}}
            onSuggestionSelected={(_e, { suggestion }) => {
              setData((prev) => prev.map((p, pi) => {
                if (i === pi) {
                  return {
                    ...p,
                    project: suggestion.name,
                    xp:      suggestion.xp,
                  };
                }
                return p;
              }));
            }}
            inputProps={{
              style:       { minWidth: '200px' },
              className:   'input',
              placeholder: 'Enter project',
              value:       d.project,
              onChange:    (e: any) => {
                setData((prev) => prev.map((p, pi) => {
                  if (i === pi) {
                    return {
                      ...p,
                      project: e.target.value,
                    };
                  }
                  return p;
                }));
              },
            }}
          />
        </td>
        <td>
          <input
            name="project_xp"
            type="number"
            value={d.xp}
            min="0"
            className="input"
            style={{ minWidth: '100px' }}
            onChange={(e) => {

              setData((prev) => prev.map((p, pi) => {
                if (i === pi) {
                  return {
                    ...p,
                    xp: parseFloat(e.target.value),
                  };
                }
                return p;
              }));
            }}
          />
        </td>
        <td>
          <input
            name="note"
            type="number"
            value={d.note}
            min="0"
            className="input"
            style={{ minWidth: '100px' }}
            onChange={(e) => {
              setData((prev) => prev.map((p, pi) => {
                if (i === pi) {
                  return {
                    ...p,
                    note: parseInt(e.target.value),
                  };
                }
                return p;
              }));
            }}
          />
        </td>
        <td>
          <div className="select">
            <select
              name="forma"
              value={d.bonus}
              onChange={(e: any) => {
                setData((prev) => prev.map((p, pi) => {
                  if (i === pi) {
                    return {
                      ...p,
                      bonus: parseInt(e.target.value),
                    };
                  }
                  return p;
                }));
              }}
            >
              <option value={1}>
                Yes
              </option>
              <option value={0}>
                No
              </option>
            </select>
          </div>
        </td>
        <td style={{ fontWeight: 'bold' }}>{end}</td>
        <td>{blackhole.toFixed(2)}</td>
      </tr>
    );
  }, [getSuggestions, suggestions]);

  const calculateLines = useMemo(() => {
    let mover = beginLevel;
    const lines: JSX.Element[] = [];

    data.forEach((d, i) => {
      const begin = mover;
      const [end, blackholesDays] = calculate_end_level(begin, d.xp || 0, d.note || 0, d.bonus);
      mover = end;

      lines.push(renderLine(d, i, begin, end, blackholesDays));
    });

    return lines;
  }, [beginLevel, data, renderLine]);

  const addRow = () => {
    setData((prev) => {
      return [
        ...prev,
        initData,
      ];
    });
  };

  const reset = () => {
    setData([initData]);
  };

  return (
    <section className="section">
      <link rel="stylesheet" type="text/css" href="static/calc/calculator.css" />
      <link rel="stylesheet" href="static/calc/bulma-rtl.min.css" />

      <StyledCalculator>
        <div className="box">
          <h1 style={{ textAlign: 'center' }} className="title">
            Calculator
            <p style={{ color: 'black', fontSize: 'x-small' }}>Based on 42evaluators.com calculator from rfautier</p>
          </h1>
        </div>
        <div className="tableResponsive">
          <table className="table is-fullwidth is-bordered">
            <thead style={{ textAlign: 'center' }}>
              <tr>
                <th>Begin Level</th>
                <th>Project</th>
                <th>Project Xp</th>
                <th>Note</th>
                <th>Bonus Coalition</th>
                <th>End level</th>
                <th>Blackhole days earned
                  <a style={{ fontSize: 'x-small' }}
                    href="https://medium.com/@benjaminmerchin/42-black-hole-deep-dive-cbc4b343c6b2">(How it works)
                  </a>
                </th>
              </tr>
            </thead>
            <tbody>
              {calculateLines}
            </tbody>
          </table>
        </div>
        <div className="button-calculator">
          <button type="button"
            style={{ marginRight: '5px' }}
            className="button small is-primary"
            onClick={addRow}>
           + Add an other project
          </button>
          <button type="button"
            style={{ marginLeft: '5px' }}
            className="button small is-danger"
            onClick={reset}>
          Reset
          </button>
        </div>
      </StyledCalculator>
    </section>
  );
}
