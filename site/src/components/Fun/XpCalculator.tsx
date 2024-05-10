import React, { useState, useEffect } from 'react';
import { useNotification } from 'Notifications/NotificationsProvider';
import { commonTitle } from 'Utils/commonTitle';
import { AxiosErrorText } from 'Hooks/AxiosErrorText';
import axios from 'axios';

export function XpCalculator() {
	const { addNotif } = useNotification();

	const [inputValue, setInputValue] = useState('');
	const [suggestion, setSuggestion] = useState('');

	const [beginLevel, setBeginLevel] = useState(0);
	const [selectedProject, setSelectedProject] = useState('');
	const [projectXp, setProjectXp] = useState(0);
	const [note, setNote] = useState(100);
	const [bonusCoalition, setBonusCoalition] = useState(false);
	const [endLevel, setEndLevel] = useState(0);
	const [blackholeDays, setBlackholeDays] = useState(0);

	const [Projects, setValues] = React.useState<any[]>([]);
	const [myProjects, setMyProjects] = React.useState<any[]>([]);
	const [ProjectsVisibility, setProjects] = React.useState<any[]>([]);
	const [myInfo, setMyInfo] = React.useState<any[]>([]);
	const [Grade, setGrade] = useState('');

	React.useEffect(() => { document.title = commonTitle('Project page'); }, []);

	React.useEffect(() => {
		axios
			.get('/?page=projects&action=get_xp_info',
				{ withCredentials: true }
			)
			.then((res) => {
				if (res.status === 200) {
					if (res.data.projects[0].name === 'CPP Module 00' || res.data.projects[0].name === 'CPP Module 01' || res.data.projects[0].name === 'CPP Module 02' || res.data.projects[0].name === 'CPP Module 03' || res.data.projects[0].name === 'CPP Module 05' || res.data.projects[0].name === 'CPP Module 06' || res.data.projects[0].name === 'CPP Module 07' || res.data.projects[0].name === 'CPP Module 08' || res.data.projects[0].name === 'Exam Rank 02' || res.data.projects[0].name === 'Exam Rank 03' || res.data.projects[0].name === 'Exam Rank 04' || res.data.projects[0].name === 'Exam Rank 05' || res.data.projects[0].name === 'Exam Rank 06')
						res.data.projects.shift();
					res.data.projects.forEach((project: any) => {
						if (project.name === 'CPP Module 04')
							project.name = 'CPP 00->04';
						if (project.name === 'CPP Module 09')
							project.name = 'CPP 05->09';
					});
					setValues(res.data.projects);
					setMyProjects(res.data.myprojects);
					setMyInfo(res.data.cursusinfo);
					setBeginLevel(res.data.cursusinfo[0].level);
					setGrade(res.data.cursusinfo[0].grade);
				}
			})
			.catch((error) => {
				addNotif(AxiosErrorText(error), 'error');
			});
	}, [addNotif]);

	const filterProjects = () => {
		const maxNoteLittleProject = 100;
		const maxNoteGeneral = 125;
		const learnerProjects = [1314, 1315, 2004, 1316, 1326, 1327, 1331, 1332, 1334, 1336, 1342, 1983, 1471, 1476, 1994, 2005, 2007, 2008, 2009, 2309, 1337]
		const littleProjects = [1342, 2309, 2007]; // CPP 00->04, CPP 05->09, NetPractice
		const isLearner = Grade === 'Learner';

		const group1 = [2009, 2008, 1476]; // So_long, FdF, Fract-ol
		const group2 = [2004, 2005]; // Pipex, Minitalk
		const group3 = [1326, 1315]; // Cub3D, MiniRT
		const group4 = [1332, 1336]; // webserv, ft_irc

		const isGroupCompleted = (group: any[]) => {
			return group.some(projectID =>
				myProjects.some(p => p.project_id === projectID && p.is_validated === 1)
			);
		};

		let filteredProjects = isLearner ? Projects.filter(project => learnerProjects.includes(project.id)) : Projects;

		return filteredProjects.map(project => {
			const myProject = myProjects.find(p => p.project_id === project.id);
			const isLittleProject = littleProjects.includes(project.id);

			let canImprove = false;
			if (myProject) {
				canImprove = isLittleProject ? myProject.final_mark < maxNoteLittleProject : myProject.final_mark < maxNoteGeneral;
			}

			const groupArrays = [group1, group2, group3, group4];
			groupArrays.forEach(group => {
				if (group.includes(project.id) && isGroupCompleted(group)) {
					const maxScore = group.reduce((max, id) => {
						const proj = myProjects.find(p => p.project_id === id);
						return proj && proj.final_mark > max ? proj.final_mark : max;
					}, 0);
					canImprove = maxScore < maxNoteGeneral;
				}
			});

			return { ...project, canImprove };
		}).filter(project => {
			const myProject = myProjects.find(p => p.project_id === project.id);
			const isCppProject = littleProjects.includes(project.id);

			if ((isGroupCompleted(group1) && group1.includes(project.id)) ||
				(isGroupCompleted(group2) && group2.includes(project.id)) ||
				(isGroupCompleted(group3) && group3.includes(project.id)) ||
				(isGroupCompleted(group4) && group4.includes(project.id))) {
				return false;
			}

			if (!myProject) {
				return true;
			}

			return isCppProject ? myProject.final_mark < maxNoteLittleProject : myProject.final_mark < maxNoteGeneral;
		});
	};

	React.useEffect(() => {
		const filteredProjects = filterProjects();
		setProjects(filteredProjects);
	}, [Projects, myProjects, myInfo]);

	const level_xp = [
		{ level: 0, xp: 0 },
		{ level: 1, xp: 462 },
		{ level: 2, xp: 2688 },
		{ level: 3, xp: 5885 },
		{ level: 4, xp: 11777 },
		{ level: 5, xp: 29217 },
		{ level: 6, xp: 46255 },
		{ level: 7, xp: 63559 },
		{ level: 8, xp: 74340 },
		{ level: 9, xp: 85483 },
		{ level: 10, xp: 95000 },
		{ level: 11, xp: 105630 },
		{ level: 12, xp: 124446 },
		{ level: 13, xp: 145782 },
		{ level: 14, xp: 169932 },
		{ level: 15, xp: 197316 },
		{ level: 16, xp: 228354 },
		{ level: 17, xp: 263508 },
		{ level: 18, xp: 303366 },
		{ level: 19, xp: 348516 },
		{ level: 20, xp: 399672 },
		{ level: 21, xp: 457632 },
		{ level: 22, xp: 523320 },
		{ level: 23, xp: 597786 },
		{ level: 24, xp: 682164 },
		{ level: 25, xp: 777756 },
		{ level: 26, xp: 886074 },
		{ level: 27, xp: 1008798 },
		{ level: 28, xp: 1147902 },
		{ level: 29, xp: 1305486 },
		{ level: 30, xp: 1484070 }
	];

	const calculate_end_level = (current_level: number, values: string | number, note: string | number, has_coa_bonus: boolean) => {
		let level_down = Math.floor(current_level);
		let level_down_xp = level_xp[level_down].xp;

		let level_sup = Math.ceil(current_level);
		let level_sup_xp = level_xp[level_sup].xp;

		let level_xp_total_current = level_sup_xp - level_down_xp;
		let current_xp = level_down_xp + (level_xp_total_current * (current_level - Math.floor(current_level)));

		let parsedValues = parseInt(values.toString());
		let project_xp_total = parsedValues * (parseInt(note.toString()) / 100);
		if (has_coa_bonus) {
			project_xp_total += project_xp_total * 0.042;
		}

		let final_xp = current_xp + project_xp_total;

		let i = 0;
		for (; i < level_xp.length; i++) {
			if (level_xp[i].xp > final_xp) {
				break;
			}
		}
		let min_xp = level_xp[i - 1].xp;
		let max_xp = level_xp[i].xp;
		let tmp_max_xp = max_xp - min_xp;
		let tmp_final_xp = final_xp - min_xp;
		let final_level = level_xp[i - 1].level + (tmp_final_xp / tmp_max_xp);
		final_level = parseFloat(final_level.toFixed(2));

		let blackholesDays = 0;
		if (current_level < 8.41) {
			let xp_final_bh = 78909;
			if (final_xp > xp_final_bh) {
				final_xp = xp_final_bh;
			}
			blackholesDays = (Math.pow((final_xp / xp_final_bh), 0.45) - (Math.pow((current_xp / xp_final_bh), 0.45))) * 593;
		}

		return [final_level, blackholesDays];
	};

	const calculateXp = () => {
		const myProj = myProjects.find(p => p.project_id === selectedProject.id);

		console.log('selectedProject', selectedProject);
		if (myProj && note <= myProj.final_mark) {
			// Si la nouvelle note est inférieure ou égale à la note existante,
			// ne pas mettre à jour le niveau de fin et les jours de trou noir.
			setEndLevel(beginLevel);
			setBlackholeDays(0);
		} else {
			// Calculer le nouveau niveau de fin et les jours de trou noir
			const [newEndLevel, newBlackholeDays] = calculate_end_level(beginLevel, projectXp, note, bonusCoalition);
			setEndLevel(newEndLevel);
			setBlackholeDays(newBlackholeDays);
		}
	};

	// const calculateXp = () => {
	// 	const myProj = myProjects.find(p => p.name === selectedProject);

	// 	let finalNote = note;
	// 	if (myProj && myProj.final_mark > note) {
	// 		finalNote = myProj.final_mark;
	// 	}

	// 	const [newEndLevel, newBlackholeDays] = calculate_end_level(beginLevel, projectXp, finalNote, bonusCoalition);
	// 	setEndLevel(newEndLevel);
	// 	setBlackholeDays(newBlackholeDays);
	// };

	// const calculateXp = () => {
	// 	const [newEndLevel, newBlackholeDays] = calculate_end_level(beginLevel, projectXp, note, bonusCoalition);
	// 	setEndLevel(newEndLevel);
	// 	setBlackholeDays(newBlackholeDays);
	// };

	useEffect(() => {
		calculateXp();
	}, [beginLevel, selectedProject, projectXp, note, bonusCoalition]);

	useEffect(() => {
		calculateXp();
	}, [beginLevel, selectedProject, projectXp, note, bonusCoalition]);

	const handleNoteChange = (event: { target: { value: any; }; }) => {
		const newNote = event.target.value;
		if (newNote >= 0 && newNote <= 125) {
			setNote(newNote);
		}
	};

	const handleProjectChange = (event: { target: { value: any; }; }) => {
		const projectName = event.target.value;
		const selectedProj = ProjectsVisibility.find(proj => proj.name === projectName);
		console.log('selectedProj', selectedProj);
		console.log('ProjectsVisibility', ProjectsVisibility);
		// if (selectedProj) {
		// 	setSelectedProject(selectedProj.name);
		// 	setProjectXp(selectedProj.difficulty);
		// }
		// const selectedProj = ProjectsVisibility.find(proj => proj.name === event.target.value);
		setSelectedProject(selectedProj.name);
		setProjectXp(selectedProj.difficulty);

		// Trouver le projet dans les projets de l'utilisateur
		const myProj = myProjects.find(p => p.project_id === selectedProj.id);
		if (myProj) {
			// Si le projet est déjà complété, définir la note par défaut sur la note existante
			setNote(myProj.final_mark);
		} else {
			// Sinon, réinitialiser la note à 100
			setNote(100);
		}
	};

	// const handleProjectChange = (event: { target: { value: any; }; }) => {
	// 	const selectedProj = ProjectsVisibility.find(proj => proj.name === event.target.value);
	// 	setSelectedProject(selectedProj.name);
	// 	setProjectXp(selectedProj.difficulty);
	// };

	const handleInputChange = (event: { target: { value: any; }; }) => {
		const value = event.target.value;
		setInputValue(value);
		updateSuggestion(value);
	};

	const updateSuggestion = (value: string) => {
		if (value) {
			const matchedSuggestion = ProjectsVisibility.find(project =>
				project.name.toLowerCase().includes(value.toLowerCase())
			);
			if (matchedSuggestion) {
				setSuggestion(matchedSuggestion.name);
			} else {
				setSuggestion('');
			}
		} else {
			setSuggestion('');
		}
	};

	const handleKeyDown = (event: { key: string; preventDefault: () => void; }) => {
		if (event.key === 'Tab' && suggestion) {
			event.preventDefault();
			const matchedProject = ProjectsVisibility.find(project => project.name === suggestion);
			if (matchedProject) {
				setInputValue(matchedProject.name);
				setSelectedProject(matchedProject.name);
				setProjectXp(matchedProject.difficulty);
			}
			setSuggestion('');
		}
	};

	return (
		<div className="mt-4 overflow-auto border-black border-2 h-[800px] resize-y">
			<h1 id="startPage" className="text-2xl">XP Calculator</h1>
			<table className="w-full min-w-max table-auto text-left">
				<thead className='sticky top-0 z-10'>
					<tr className="bg-blue-gray-50">
						<th className="px-4 py-2">Begin Level</th>
						<th className="px-4 py-2">Project</th>
						<th className="px-4 py-2">Project Xp</th>
						<th className="px-4 py-2">Note</th>
						<th className="px-4 py-2">Bonus Coalition</th>
						<th className="px-4 py-2">End level</th>
						<th className="px-4 py-2">Blackhole days earned</th>
					</tr>
				</thead>
				<tbody>
					<tr className="bg-blue-gray-100">
						<td className="border px-4 py-2">
							<input
								type="number"
								value={beginLevel}
								min="0"
								max="30"
								style={{ width: '5rem' }}
							/>
						</td>
						<td className="border px-4 py-2 relative">
							{/* <input
								type="text"
								value={inputValue}
								onChange={handleInputChange}
								onKeyDown={handleKeyDown}
								className="w-full bg-transparent"
								style={{
									top: '0.5em',
									position: 'absolute',
									zIndex: 2
								}}
							/>
							<input
								type="text"
								value={inputValue + suggestion.substring(inputValue.length)}
								disabled
								className="w-full bg-white text-gray-400"
								style={{
									top: '0.5em',
									position: 'absolute',
									zIndex: 1
								}}
							/> */}
							<select value={selectedProject} onChange={handleProjectChange}>
								{ProjectsVisibility.map((project, index) => (
									<option key={index} value={project.name}>{project.name} {project.canImprove && <span>(improve score)</span>}</option>
								))}
							</select>
						</td>
						<td className="border px-4 py-2">{projectXp}</td>
						<td className="border px-4 py-2">
							<input
								type="number"
								value={note}
								onChange={handleNoteChange}
								min="0"
								max="125"
							/>
						</td>
						<td className="border px-4 py-2">
							<input
								type="checkbox"
								checked={bonusCoalition}
								onChange={(event) => { setBonusCoalition(event.target.checked); }}
							/>
						</td>
						<td className="border px-4 py-2">{endLevel}</td>
						<td className="border px-4 py-2">{blackholeDays.toFixed(2)}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
