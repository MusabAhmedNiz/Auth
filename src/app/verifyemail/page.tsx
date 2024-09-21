"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

function Page() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error.response.data);
    }
  };
  useEffect(() => {
    const urlToken = searchParams.get("token"); // Get the token from the URL

    if (urlToken) {
      setToken(urlToken);
    } else {
      setToken("");
    }
  }, [searchParams]);

  return (
    <div>
      <h1>Verify email</h1>
      <h2>{token ? `This is your verify token ${token}` : "no token"}</h2>
      <button onClick={verifyUserEmail}>click here</button>
      {verified && <div>Verified</div>}
      {error && <div>Error</div>}
    </div>
  );
}

export default Page;
