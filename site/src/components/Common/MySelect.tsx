import classNames from 'classnames';
import React from 'react';

interface MySelectProps extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  className?: string
  label?: string
}

const MySelect = (props: MySelectProps): JSX.Element => {
  return (
    <div className='relative w-full min-w-[200px] h-10'>
      <select
        {...props}
        className={classNames(
          props.className,
          props.label ? 'border-t-transparent focus:border-t-transparent' : '',
          'peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0',
          'transition-all border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 dark:border-t-transparent dark:border-gray-700'
        )}
      >
        {props.children}
      </select>
      {props.label &&
        <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate  leading-tight peer-focus:leading-tight peer-disabled:text-transparent transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px]
            before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent
            after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent
            peer-placeholder-shown:leading-[3.75] text-gray-500 dark:text-gray-300
            peer-placeholder-shown:text-blue-gray-500 peer-disabled:peer-placeholder-shown:text-blue-gray-500
            dark:peer-placeholder-shown:text-green-500 dark:peer-disabled:peer-placeholder-shown:text-green-500
            peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900
            dark:peer-focus:border-gray-700 dark:before:border-gray-700 dark:peer-focus:before:!border-gray-700 dark:after:border-gray-700 dark:peer-focus:after:!bordergray-700">
          {props.label}
        </label>
      }
    </div>
  );
};

export default MySelect;
