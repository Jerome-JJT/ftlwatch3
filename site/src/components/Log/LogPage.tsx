import React, { SyntheticEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { UseLoginDto } from "./dto/useLogin.dto";

interface LogPageProps {
  loginer: UseLoginDto;
}

export default function LogPage({ loginer }: LogPageProps) {
  const [pageMessage, setPageMessage] = React.useState("");

  const [loginName, setLoginName] = React.useState("");
  const [password, setPassword] = React.useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    axios
      .post("/api/login/basic", {
        username: loginName,
        password: password,
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
        else {
          // setTfa(true);
          // setUserId(res.data.id);
          // setPageMessage("");
        }
      })
      .catch(() => setPageMessage("Login error"));
    // }
  };

  return (
    <div className="mt-6 flex justify-center">
      <form className="w-98 center justify-center border border-gray-500 bg-gray-200 py-2 pt-10 shadow-lg">
        <div className="content sm:w-98 lg:w-98 center mh-8 w-full content-center items-center justify-center text-center">
          <>
            <div className="center mb-6 flex w-80 content-center justify-center px-6 text-center">
              <label className="text-sl block w-2/5 pr-4 text-right font-medium text-gray-900 dark:text-gray-800">
                Login name
              </label>
              <input
                id="loginName"
                className="block w-3/5 rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                type="text"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                required
              />
            </div>

            <div className="center mb-6 flex w-80 content-center justify-center px-6 text-center">
              <label className="text-sl block w-2/5 pr-4 text-right font-medium text-gray-900 dark:text-gray-800">
                Password
              </label>
              <input
                id="password"
                className="block w-3/5 rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              onClick={handleSubmit}
              className="center content-center rounded-lg bg-blue-700 px-5 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:w-auto"
            >
              Log in
            </button>
          </>

          <div className="mt-3 h-6 text-center text-sm">{pageMessage}</div>
        </div>
      </form>
    </div>
  );
}
