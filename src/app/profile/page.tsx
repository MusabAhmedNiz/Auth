"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();
  const [data, setData] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post("/api/users/me");
        console.log(res);
        setData(res.data.data._id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);


  const logout = async () => {
    await axios.get("/api/users/logout");
    toast.success("logout success");
    router.push("/login");
  };

  return (
    <div>
      hey!
      <h1>
        {data === "" ? (
          "No Data Found"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}{" "}
      </h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default page;
