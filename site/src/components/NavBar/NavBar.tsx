import classNames from 'classnames'
import { Link } from 'react-router-dom'
import ProfileButton from './ProfileButton'
import { type UseLoginDto } from '../Hooks/useLogin'

interface NavBarProps {
  loginer: UseLoginDto
  openedMenu: string
  setOpenedMenu: (menu: string) => void
}

export default function NavBar ({
  loginer,
  openedMenu,
  setOpenedMenu
}: NavBarProps): JSX.Element {
  const handleClick = (): void => {
    if (openedMenu !== 'leftdrawer') {
      setOpenedMenu('leftdrawer')
    } //
    else {
      setOpenedMenu('')
    }
  }

  // const ref = React.useRef<HTMLDivElement | null>(null);
  // React.useEffect(() => {
  //   const checkIfClickedOutside = (e: any) => {
  //     if (ref && !loginer.logged) {
  //       if (
  //         openedMenu &&
  //         openedMenu === "burger" &&
  //         !ref.current?.contains(e.target)
  //       ) {
  //         setOpenedMenu("");
  //       }
  //     }
  //   };
  //   document.addEventListener("mousedown", checkIfClickedOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", checkIfClickedOutside);
  //   };
  // }, [openedMenu, loginer.logged, setOpenedMenu]);

  //
  return (
    <header className="top-0 z-50 w-full">
      <nav
        className={classNames(
          'z-50 px-2 py-2.5 shadow-lg sm:px-4'
        )}
      >
        <div className="mx-auto flex flex-wrap items-center justify-between">

          <div>
            <button
              type="button"
              onClick={handleClick}
              className="ml-1 inline-flex items-center justify-end rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <svg
                className="h-6 w-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <Link to="/" className="justify-start">
            <img
              src="https://42lausanne.ch/wp-content/uploads/2021/01/42_logo.svg"
              height="50"
              className="mr-3 h-6 sm:h-9"
              alt=""
            />
          </Link>

          <ProfileButton
            loginer={loginer}
          />

        </div>
      </nav>
    </header>
  )
}
