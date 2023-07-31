import React from "react";
import { useNavigate } from "react-router-dom";
import { UseLoginDto } from "../Hooks/useLogin";


interface LogoutProps {
  loginer: UseLoginDto;
}

export default function Logout({ loginer }: LogoutProps) {
  const [pageMessage, setPageMessage] = React.useState("Logout");
  const navigate = useNavigate();

  React.useEffect(() => {
    
    loginer.logout();
    setPageMessage("Logout successful, redirecting...");
    // loginer.getUserData();

    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, []);

  return <><div className="mt-3 h-6 text-center text-sm">{pageMessage}</div></>;
}
