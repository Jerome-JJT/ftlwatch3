import React, { useState, useEffect } from 'react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { commonTitle } from 'Utils/commonTitle';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import axios from 'axios';

export function XpCalculator() {

  //   const series = [currentLevel, currentLevel];
  //   const labels = ["Current level", "New level"];
  //   const xpForSeries = [];
  //   const bhDays = [];
  //   let initialUserXP;
  //   let charts;
  //   let newLevel;

  //   function addProject = (number: number) => {
  //     let userXP;
  //     let reason = "New level";
  //     const levelSelect = document.getElementsByName("level")[number];
  //     const subjectSelect = document.getElementsByName("project")[number];
  //     const xpSelect = document.getElementsByName("xp")[number];
  //     const mark = document.getElementsByName("mark")[number];

  //     const updateUserXP = () => {
  //       const level = levelSelect.value;
  //       let levelData = xpData.find(({ lvl }) => lvl == parseInt(level));
  //       if (!levelData)
  //         levelData = xpData[xpData.length-1];
  //       userXP = levelData.xp + levelData.xpToNextLevel * (level - parseInt(level));
  //       if (number == 0) {
  //         initialUserXP = userXP;
  //         xpForSeries[0] = userXP;
  //       }
  //     }
  //     updateUserXP();

  //     const updateLevel = () => {
  //       const newXP = userXP + parseInt(xpSelect.value||0)*((mark.value||100)/100);
  //       if (levelSelect.value < 0 || mark.value < 0) return;
  //       xpForSeries[number+1] = newXP;

  //       let levelForXP;
  //       let i;
  //       for (i in xpData) {
  //         i = parseInt(i);
  //         if (xpData[i].xp > newXP) {
  //           levelForXP = xpData[i-1];
  //           break;
  //         }
  //       }

  //       let levelForInitialXP;
  //       for (let j in xpData) {
  //         j = parseInt(j);
  //         if (xpData[j].xp > initialUserXP) {
  //           levelForInitialXP = xpData[j-1];
  //           break;
  //         }
  //       }

  //       const xpToNextLevel = Math.max(0, parseInt(xpData[i].xp-newXP));
  //       document.querySelector(".xp-required").
  //         textContent = `${xpToNextLevel} XP until next level`;

  //       if (!levelForXP)
  //         newLevel = 30;
  //       else
  //         newLevel = levelForXP.lvl +
  //           (newXP - levelForXP.xp)/levelForXP.xpToNextLevel;
  //       series[number+1] = newLevel.toFixed(2);
  //       labels[number+1] = reason;
  //       charts.updateSeries([{
  //         name: "Level",
  //         data: series,
  //       }]);
  //       charts.updateOptions({ labels, });

  //       const levelsEarned = series[series.length-1] - document.getElementsByName("level")[0].value;
  //       let sign = "+";
  //       if (levelsEarned < 0)
  //         sign = "";
  //       document.querySelector(".plus-level").
  //         textContent = sign + levelsEarned.toFixed(2);

  //       function calcBlackhole(oldXP, newXP) {
  //         const blackholeEarned = parseInt((((
  //           Math.min(newXP, 78880)/49980)**0.45)
  //             -((oldXP/49980)**0.45))*483);
  //         if (oldXP <= newXP && blackholeEarned < 0) {
  //           return "+ 0 days";
  //         }

  //         sign = "+";
  //         if (blackholeEarned < 0)
  //           sign = "";
  //         return sign + blackholeEarned + (blackholeEarned == 1 ? " day" : " days");
  //       }
  //       if (xpForSeries[number] != undefined)
  //         bhDays[number+1] = calcBlackhole(xpForSeries[number], newXP);
  //       document.querySelector(".plus-days").
  //         textContent = calcBlackhole(initialUserXP,
  //           xpForSeries[xpForSeries.length-1]);
  //     }
  //     updateLevel();

  //     levelSelect.addEventListener("input", () => {
  //       currentLevel = levelSelect.value;
  //       series[number] = currentLevel;
  //       updateUserXP();
  //       updateLevel();
  //     });
  //     xpSelect.addEventListener("input", () => {
  //       mark.value = "100";
  //       subjectSelect.selectedIndex = 0;
  //       reason = `+ ${xpSelect.value} XP`;
  //       updateLevel();
  //     });
  //     subjectSelect.addEventListener("change", () => {
  //       for (const subject of subjects) {
  //         if (subject.name.trim() == subjectSelect.selectedOptions[0].value.trim()) {
  //           xpSelect.value = subject.XP;
  //           reason = subject.name;
  //           updateLevel();
  //         }
  //       }
  //     });
  //     mark.addEventListener("input", () => {
  //       updateLevel(subjectSelect.selectedOptions[0].value);
  //     });
  //   }


  //   let nth = 1;
  //   const addAnotherLevel = () => {
  //     const projects = document.querySelector("#projects");
  //     const projectPickers = document.querySelectorAll(".project-picker");
  //     const newProjectPicker = projectPickers[projectPickers.length-1].cloneNode(true); // deep

  //     if (newLevel)
  //       newProjectPicker.querySelector("*[name=\"level\"]").value = newLevel.toFixed(2);

  //     newProjectPicker.querySelector("*[name=\"xp\"]").value = "";
  //     document.querySelector("#add-project").remove();
  //     const divider = document.createElement("div");
  //     divider.classList.add("divider", "!mt-6", "!mb-5");
  //     projects.appendChild(divider);
  //     projects.appendChild(newProjectPicker);
  //     newProjectPicker.querySelector("#add-project")
  //       .addEventListener("click", addAnotherLevel);
  //     addProject(nth++);
  //   }
  //   document.querySelector("#add-project").
  //     addEventListener("click", addAnotherLevel);
  //   addProject(0);
  // }

  return (
    <>
      <div className="flex items-center m-10 justify-center h-[40%] translate-y-2/4 lg:translate-y-0 lg:h-[80%] overflow-x-hidden">
        <div id="projects" className="pr-2 flex flex-col h-full overflow-y-scroll overflow-x-hidden">
          <div className="project-picker flex flex-col gap-2 grow justify-center">
            <span>
              <label htmlFor="level">Begin level</label>
              <input
                className="w-full input input-bordered"
                type="number"
                id="level"
                name="level"
                min="0"
                max="30"
                value={ 13.5 }
                placeholder={ 13.5 }
              />
            </span>

            <span>
              <label htmlFor="project">Project</label>
              <select className="select select-bordered w-[99%]" name="project" id="project">
                <option disabled selected>Choose one...</option>
                {/* for _, subject := range subjects {
                <option>{ subject.Name }</option>
              } */}
              </select>
            </span>

            <span>
              <div className="divider !mt-0 !mb-2 text-center">OR</div>
              <input
                className="w-full input input-bordered"
                type="number"
                id="xp"
                name="xp"
                placeholder="XP"
              />
            </span>

            <span>
              <label htmlFor="mark">Final mark</label>
              <input
                className="w-full input input-bordered"
                type="number"
                id="mark"
                name="mark"
                value="100"
                placeholder="100"
                min="0"
                max="125"
              />
            </span>

            <button id="add-project" className="btn mt-2">Add project...</button>
          </div>
        </div>

        <div id="graph"></div>
      </div>
      <div className="stats absolute bottom-0 right-0">
        <div className="stat">
          <div className="stat-title">Levels</div>
          <div className="plus-level stat-value">+0.00</div>
          <div className="xp-required stat-description">Unknown XP until next level</div>
        </div>
        <div className="stat">
          <div className="stat-title">Blackhole</div>
          <div className="plus-days stat-value">+0 days</div>
          <div className="stat-description"><a className="underline" href="https://medium.com/@benjaminmerchin/42-black-hole-deep-dive-cbc4b343c6b2">How does it work!!</a></div>
        </div>
      </div>
    </>

  );
}
