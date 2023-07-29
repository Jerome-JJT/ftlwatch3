import {
  Drawer,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";

import { UseLoginDto } from "../Log/dto/useLogin.dto";

interface NavBarProps {
  // loginer: UseLoginDto;
  openedMenu: string;
  setOpenedMenu: Function;
}

export default function LeftDrawer({
  // loginer,
  openedMenu,
  setOpenedMenu,
}: NavBarProps) {
  
  // const handleClick = () => {
  //   if (openedMenu === "burger") {
  //     if (!loginer.logged) setOpenedMenu("");
  //   } else {
  //     if (!loginer.logged) setOpenedMenu("burger");
  //   }
  // };
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
    // <></>
    <Drawer open={open} onClose={() => setOpenedMenu("")} className="p-4">
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            Material Tailwind
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={() => setOpenedMenu("")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <Typography color="gray" className="mb-8 pr-4 font-normal">
          Material Tailwind features multiple React and HTML components, all
          written with Tailwind CSS classes and Material Design guidelines.
        </Typography>
        <div className="flex gap-2">
          <Button size="sm">Get Started</Button>
          <Button size="sm" variant="outlined">
            Documentation
          </Button>
        </div>
      </Drawer>
  );
}
