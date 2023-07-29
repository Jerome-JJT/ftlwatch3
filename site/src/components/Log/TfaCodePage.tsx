import React, { SyntheticEvent } from "react";
import axios from "axios";
import { UseLoginDto } from "./dto/useLogin.dto";
import { useNavigate } from "react-router-dom";

interface TfaCodePageProps {
  loginer: UseLoginDto;
}

export default function TfaCodePage({ loginer }: TfaCodePageProps) {
  const [pageMessage, setPageMessage] = React.useState("");
  const [tfaCode, setTfaCode] = React.useState("");

  const navigate = useNavigate();

  const handleUpdate = async (value: string) => {
    if (value != null && !isNaN(Number(value.toString())))
      setTfaCode(value.substring(0, 6));
  };

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    axios
      .post("/api/tfa/authenticate", {
        id: loginer.tfaUserId.current,
        tfa_code: tfaCode,
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
      })
      .catch((error) => {
        if (error.response.status === 408) {
          setPageMessage("Login timeout, retry login...");
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } //
        else if (error.response.data.message) {
          setPageMessage(error.response.data.message);
        } //
        else {
          setPageMessage("Unexcepted error");
        }
      });
  };

  return (
    <div className="mt-6 flex justify-center">
      <form className="w-98 center justify-center border border-gray-500 bg-gray-200 py-2 pt-10 shadow-lg">
        <div className="content sm:w-98 lg:w-98 center mh-8 w-full content-center items-center justify-center text-center">
          <div className="center mb-6 flex w-80 content-center justify-center px-6 text-center">
            <label className="text-sl block w-2/5 pr-4 text-right font-medium text-gray-900 dark:text-gray-800">
              Code
            </label>
            <input
              id="tfaCode"
              className="block w-3/5 rounded-lg border border-gray-300 bg-gray-50 p-1.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              type="text"
              placeholder="_ _ _ _ _ _"
              value={tfaCode}
              onChange={(e) => handleUpdate(e.target.value)}
            />
          </div>
          <button
            onClick={handleSubmit}
            className="center content-center rounded-lg bg-blue-700 px-5 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:w-auto"
          >
            Log in
          </button>
          <div className="mt-3 h-6 text-center text-sm">{pageMessage}</div>
        </div>
      </form>
    </div>
  );
}
