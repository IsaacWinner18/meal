"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, PlayCircle, Share2 } from "lucide-react";

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [progress, setProgress] = useState(0);
  const [canClaim, setCanClaim] = useState(true);
  const [loger, setLogErr] = useState({
    one: "",
    two: "",
  });
  // const [firstName, setFirstName] = useState()
  const [lastClaimed, setLastClaimed] = useState(null);

  const [peopleData, setPeopleData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    userId: "",
  });

  useEffect(() => {
    const loadTelegramSDK = () => {
      if (typeof window.Telegram === "undefined") {
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-web-app.js";
        script.onload = () => {
          console.log("Telegram WebApp SDK loaded.");

          // Example usage after SDK is loaded
          if (typeof Telegram !== "undefined" && Telegram.WebApp) {
            const webApp = Telegram.WebApp;           

            // Extract user data from initDataUnsafe
            const userData = webApp.initDataUnsafe?.user;
            if (userData) {
              // Access user properties
              const { first_name, last_name, username, id } = userData;

              webApp.ready();

              setPeopleData((prev) => ({
                ...prev,
                firstName: first_name,
                lastName: last_name,
                userName: username,
                userId: id,
              }));

              fetchData({
                firstName: first_name,
                lastName: last_name,
                userName: username,
                userId: id,
              });
              // console.log("User's first name:", first_name);
            } else {
              console.log("User data not available.");
            }
          }
        };
        script.onerror = () => {
          console.error("Failed to load Telegram WebApp SDK.");
        };
        document.head.appendChild(script);
      } else {
        console.log("Telegram WebApp SDK already loaded.");
      }
    };

    loadTelegramSDK();
  }, []);

  const fetchData = async (newData) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          // firstName: firstName,
          firstName: newData.firstName,
          lastName: newData.lastName,
          usernamedb: newData.userName,
          mlcoin: balance,
        }),
      });

      if (!response.ok) {
        // console.log(` this is the api url: ${process.env.NEXT_PUBLIC_API_URL}`)
        throw new Error("failed to register");
      }

      const data = await response.json();
      setLastClaimed(new Date(data.user.lastClaimed));
      

      // alert(data.toString())
      setBalance(data.user.mlcoin);
    } catch (error) {
      console.log(`Fetch error: ${error.message}`);
      // setLogErr((prev) => ({
      //   two: error.message,
      // }));
    }
  };

  const handleClaim = async () => {
    // if (canClaim) {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ usernamedb: peopleData.userName }),
      });

      if (!response.ok) {
        throw new Error("failed to update mlcoin");
      }

      const data = await response.json();

      setBalance(data.user.mlcoin);
      setProgress(0);
      setCanClaim(false);
      setTimeout(() => {
        setCanClaim(true);
      }, 2 * 60 * 1000);
      if (loger.one) setLogErr((prev) => ({ ...prev, one: "" }));
    } catch (error) {
      console.log(`The adeola error ${error}`);
      // setLogErr((prev) => ({
      //   one: error.message,
      // }));
    }
  };

  useEffect(() => {
    if (lastClaimed) {
      const interval = 1000;
      const date1 = new Date(lastClaimed);
      const date2 = new Date();

      const differenceInMinutes =
        (date2.getTime() - date1.getTime()) / (1000 * 60);
      const increment = 100 / ((differenceInMinutes * 60 * 1000) / interval);

      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + increment;
        });
      }, interval);
      return () => clearInterval(timer);
    }
  }, [lastClaimed]);

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col">
      <div className="flex justify-between items-start bg-black rounded-bl-lg rounded-br-lg mb- p-2">
        <div>
          <h1 className="text-lg font-bold text-white">
            {peopleData.firstName || "loading"}{" "}
            {peopleData.lastName || "loading"}
          </h1>
          <p className="text-gray-500 text-sm ">
            ID: {peopleData.userId || "loading"}
            <i className="hidden">{peopleData.userName}</i>
          </p>
        </div>
        <div className="rounded-lg shadow-xl shadow-blue-700">
          {/* <Flame className="text-blue-600" size={24} /> */}
          <Image src="/wallet.gif" alt="Wallet.gif" width={45} height={45} />
        </div>
      </div>

      <div className="bg-gradient-to-r from-neutral-900 to-black shadow-inner shadow-black rounded-3xl p-3 mx-2 my-1">
        <h2 className="text-center mb-2 font-bold text-white">Current Balance</h2>
        <div className="flex items-center justify-center gap-2 text-3xl font-bold mb-2">
          <ArrowUp className="text-blue-200 bg-blue-600 rounded-full p-1" />
          <span className="text-neutral-100">{balance}</span>
          <span className="text-neutral-400 shadow-xl shadow-blue-100 hover:text-neutral-300">
            MLC
          </span>
        </div>
        <div className="bg-neutral-900 rounded-full text-center my-4 shadow-inner shadow-black inset-">
          <span className="text-white text-sm font-mono">
            EARNING RATE +400.00 MLC/hr{" "}
          </span>
        </div>

        {/* Not a component but sha  */}

        <div className="bg-gradient-to-t from-neutral-900 to-black rounded-3xl px-6 py-5 shadow-xl shadow-blue-00 mt-16">
          <h2 className="text-lg text-center text-white mb-3">Next GRAB!</h2>
          <Progress value={progress} className="mb-4 bg-white text-white" />
          <div className="mx-16">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleClaim}
                disabled={!canClaim}
                className="w-full py-6 text-xl bg-blue-700 shadow-inner shadow-blue-200 hover:bg-blue-600 transition-colors"
              >
                Claim
              </Button>
            </motion.div>
          </div>
          <div className="text-center text-white font-bold font-mono mt-1">
            1000
            <span>
              {" "}
              <i>MLC</i>
            </span>
            <span> Available </span> &nbsp;
            {/* <span>
              {loger.one}
              {loger.two}
            </span> */}
          </div>
        </div>

      </div>
<div>
        <Card className="bg-gradient-to-b from-neutral-800 to-black border-black mx-2 mb-1">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-600 gap-2">
              <PlayCircle className="text-white" />
              Watch Videos
            </CardTitle>
            <CardDescription>Earn up to 50 MLC per video watched</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-600 hover:bg-blue-400">
              Start Watching
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-neutral-800 to-black border-black mx-2 mb-28">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-600 gap-2">
              <PlayCircle className="text-white" />
              Watch Videos
            </CardTitle>
            <CardDescription>Earn up to 50 MLC per video watched</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-600 hover:bg-blue-400">
              Start Watching
            </Button>
          </CardContent>
        </Card>
        </div>

      <Footer />
    </div>
  );
}
