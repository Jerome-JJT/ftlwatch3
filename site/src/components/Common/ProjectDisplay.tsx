import { Checkbox } from '@material-tailwind/react';
import { Link } from 'react-router-dom';

const MyInput = ({ project, link }: {project: any, link: boolean}): JSX.Element => {

  return (
    <>
      <div className='blue-gray grid grid-cols-2 gap-1 place-content-start'>

        <p>Cursus</p>
        <p>{project.main_cursus}</p>

        {(project.difficulty !== undefined && project.difficulty !== null) && <>
          <p>Difficulty</p>
          <p>
            {project.difficulty}
          </p>
        </>
        }

        {(project.session_duration_days !== undefined && project.session_duration_days !== null) && <>
          <p>Max time</p>
          <p>
            {`${project.session_duration_days} days` }
          </p>
        </>
        }

        {project.session_scale_duration && <>
          <p>Slot</p>
          <p>
            {project.session_scale_duration / 60} minutes
          </p>
        </>
        }

        {project.rule_retry_delay && <>
          <p>Cooldown</p>
          <p>
            {project.rule_retry_delay} jours
          </p>
        </>
        }

        { link &&
          <Link to={`/basics/projects/${project.id}`} className='col-span-2'>
            <button className='col-span-2 text-xs'>Details</button>
          </Link>
        }
      </div>

      <div className='blue-gray grid grid-cols-2 gap-1 place-content-start grow'>
        <p>Exam</p>
        <div><Checkbox crossOrigin={undefined} containerProps={{ className: 'p-0' }} checked={project.is_exam} readOnly disabled /></div>

        <p>Solo</p>
        <div><Checkbox crossOrigin={undefined} containerProps={{ className: 'p-0' }} checked={project.session_is_solo} readOnly disabled /></div>

        <p>Moulinette</p>
        <div><Checkbox crossOrigin={undefined} containerProps={{ className: 'p-0' }} checked={project.session_has_moulinette} readOnly disabled /></div>

        <p>Lausanne</p>
        <div><Checkbox crossOrigin={undefined} containerProps={{ className: 'p-0' }} checked={project.has_lausanne} readOnly disabled /></div>

        {project.session_correction_number && <>
          <p>Correction nb</p>
          <p>{project.session_correction_number}</p>
        </>
        }

        {(project.rule_min || project.rule_max) && <>
          <p>
            Min: {project.rule_min || '-'}
          </p>
          <p>
            Max: {project.rule_max || '-'}
          </p>
        </>
        }

        <p>Correction time</p>
        <p>
          {project.session_terminating_after ? project.session_terminating_after : '∞'} days
        </p>

      </div>
    </>

  );
};

export default MyInput;
