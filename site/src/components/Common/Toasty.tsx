import React from 'react';
import {
  Alert
} from '@material-tailwind/react';

interface ToastyProps {
  className: string
  closeAlert: () => void
  icon?: React.ReactNode
  children?: React.ReactNode
}

const Toasty = ({ className, closeAlert, icon, children }: ToastyProps): JSX.Element => {
  return (
    <Alert
      open={true}
      icon={icon}
      className={className}
      onClose={closeAlert}>
      {children}
    </Alert>

  // <div
  //   className={classNames('mb-3 inline-flex w-full items-center rounded-lg px-6 py-5 text-base', addClass)}
  //   role="alert"
  //   data-te-alert-init
  //   data-te-alert-show>
  //   {icon && (
  //     <span className="mr-2">
  //       {(
  //         React.Children.map(icon, (child) => {
  //           return React.cloneElement(child as ReactElement, { size: '22px' });
  //         })
  //       )}
  //     </span>
  //   )}
  //   {children}
  //   <button
  //     type="button"
  //     className="ml-auto box-content rounded-none border-none p-1 text-warning-900 opacity-50 hover:text-warning-900 hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
  //     data-te-alert-dismiss
  //     aria-label="Close">
  //     <span className="w-[1em] focus:opacity-100 disabled:pointer-events-none disabled:select-none disabled:opacity-25 [&.disabled]:pointer-events-none [&.disabled]:select-none [&.disabled]:opacity-25">
  //       <AiOutlineClose size='22px'/>
  //     </span>
  //   </button>
  // </div>
  );
};

export default Toasty;
