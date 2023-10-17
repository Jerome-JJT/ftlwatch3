import React from 'react';

interface MyInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  className?: string
  label?: string
}

const MyInput = (props: MyInputProps): JSX.Element => {
  return (
    <div className="relative w-full min-w-[200px] h-11">
      <input 
        {...props}
        placeholder=" "
        className="
        border-t-transparent focus:border-t-transparent 
        dark:border-t-transparent dark:focus:border-t-transparent
        peer w-full h-full bg-transparent 
        font-sans font-normal 
        outline outline-0 focus:outline-0  
        disabled:border-0
        transition-all 
        border focus:border-2
        text-sm

        px-3 py-3 placeholder-shown:border rounded-md
        
        !text-gray-900 dark:!text-gray-300
        disabled:bg-blue-gray-50

        border-blue-gray-200 dark:border-gray-700

        placeholder-shown:border-blue-gray-200
        placeholder-shown:border-t-blue-gray-200

        focus:border-gray-900
        "
        />


        <label className="flex w-full h-full select-none pointer-events-none 
        absolute left-0 font-normal 
        !overflow-visible truncate  leading-tight 
        peer-focus:leading-tight peer-disabled:text-transparent 
        transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] 
        before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 
        peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 
        before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all 
        peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border 
        after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent 
        after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 
        after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[4.1]

      text-gray-900 dark:text-gray-300
           border-blue-gray-200   before:border-blue-gray-200   after:border-blue-gray-200
      !dark:border-gray-700   !dark:before:border-gray-700   !dark:after:border-gray-700

            peer-placeholder-shown:text-blue-gray-500      peer-disabled:peer-placeholder-shown:text-blue-gray-500
      dark:peer-placeholder-shown:text-blue-gray-500 dark:peer-disabled:peer-placeholder-shown:text-blue-gray-500
           peer-focus:!text-gray-900        peer-focus:before:!border-gray-900      peer-focus:after:!border-gray-900
      dark:peer-focus:border-gray-700 dark:peer-focus:before:!border-gray-700 dark:peer-focus:after:!border-gray-700
        
        ">
          Link github 
        </label>
      </div>

);
};

export default MyInput;
