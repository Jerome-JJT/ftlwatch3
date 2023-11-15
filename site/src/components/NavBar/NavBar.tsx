import AppLogo from '../../assets/logo_transparent_small.png';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import { AiOutlineMenu } from 'react-icons/ai';

interface NavBarProps {
  openedMenu: string
  setOpenedMenu: (menu: string) => void
}

export default function NavBar({
  openedMenu,
  setOpenedMenu,
}: NavBarProps): JSX.Element {
  const handleClick = (): void => {
    if (openedMenu !== 'leftdrawer') {
      setOpenedMenu('leftdrawer');
    } //
    else {
      setOpenedMenu('');
    }
  };


  return (
    <header className="top-0 z-50 w-full sticky">
      <nav
        className={classNames(
          'z-50 px-2 py-2.5 shadow-lg sm:px-4 bg-[#006060]'
        )}
      >
        <div className="mx-auto flex flex-wrap items-center justify-between">

          <div>
            <button
              type="button"
              onClick={handleClick}
              className="ml-1 inline-flex items-center justify-end rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <AiOutlineMenu size="22" />
            </button>
          </div>

          <Link to="/" className="justify-start">
            <img src={AppLogo}
              className="h-12"
            />
          </Link>

          <ProfileButton />

        </div>
      </nav>
    </header>
  );
}
