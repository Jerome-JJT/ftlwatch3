import React from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UseLoginDto } from "./dto/useLogin.dto";

interface LoginApiProps {
  loginer: UseLoginDto;
}

export default function LoginApi({ loginer }: LoginApiProps) {
  const [pageMessage, setPageMessage] = React.useState("42 api loading");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  let code = searchParams.get("code");
  let state = searchParams.get("state");

  React.useEffect(() => {
    if (
      code != null &&
      state != null &&
      (loginer.token === undefined || loginer.token === "")
    ) {
      axios
        .post("/api/login/apicallback", {
          code: code,
          state: state,
        })
        .then((res) => {
          if (res.status === 201 && res.data["access_token"]) {
            localStorage.setItem("token", res.data["access_token"]);
            loginer.setToken(res.data["access_token"]);

            setPageMessage("Login successful, redirecting...");
            setTimeout(() => {
              navigate("/");
            }, 3000);
          } //
          else if (res.status === 206 && res.data["id"] !== undefined) {
            loginer.tfaUserId.current = res.data["id"];

            setPageMessage("Tfa needed, redirecting...");
            setTimeout(() => {
              navigate("/login_tfa");
            }, 3000);
          } //
          else if (res.status === 203) {
            // setPageMessage("Login successful, redirecting...");
          } //
          else {
            setPageMessage("Error contacting 42 API");
          }
        })
        .catch(() => {
          setPageMessage("Error contacting 42 API");
        });

      // .catch((error) => {setPageMessage('wait...'); console.log(error)}); /* en strict mode envoie 2 requetes, 1 qui throw une erreur */
    } //
    else if (code == null && state == null) {
      setPageMessage("Error missing infos for 42 API");
    }
  }, [code, loginer, navigate, state]);

  return (
    <>
      <div className="mt-3 h-6 text-center text-sm">{pageMessage}</div>
    </>
  );
}
