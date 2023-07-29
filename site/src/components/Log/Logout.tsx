import React from "react";
import { useNavigate } from "react-router-dom";

import { UseLoginDto } from "./dto/useLogin.dto";

interface LogoutProps {
  loginer: UseLoginDto;
}

export default function Logout({ loginer }: LogoutProps) {
  const [pageMessage, setPageMessage] = React.useState("Logout");
  const [redirecting, setRedirecting] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (loginer.token !== undefined && loginer.token !== "") {
      localStorage.clear();
      chats.deco();
      gamer.deco();

      loginer.setToken(localStorage.getItem("token") || "");
    } //
    else if (redirecting === false) {
      setPageMessage("Logout successful, redirecting...");
      loginer.getUserData();

      setTimeout(() => {
        navigate("/");
      }, 3000);
      setRedirecting(true);
    }
  }, [loginer.token, loginer, navigate, redirecting]);

  return <div className="mt-3 h-6 text-center text-sm">{pageMessage}</div>;
}
