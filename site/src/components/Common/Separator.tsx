import classNames from 'classnames';

interface SeparatorProps{
  className?: string
}

const Separator = ({ className }: SeparatorProps): JSX.Element => {
  return (
    <div className={classNames('border-t border-gray-300 my-4', className)}></div>
  );
};

export default Separator;
