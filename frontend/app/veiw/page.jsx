"use client";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import Videos from "@/components/videos";
import Wallet from "./wallet";
export default function View({ userData, refCode }) {

  const [balance, setBalance] = useState(0);
  const [progress, setProgress] = useState(0);
  const [canClaim, setCanClaim] = useState(true);
  const [loger, setLogErr] = useState({
    one: "",
    two: "",
  });
  // const [videos, setVideos] = useState([]);
  const [lastClaimed, setLastClaimed] = useState(null);
  const [claimedVideos, setClaimedVideos] = useState([]);

  const [peopleData, setPeopleData] = useState({
    firstName: "",
    userId: "",
    referralCode: "",
  });
  const [referredBy, setReferredBy] = useState();

  // useEffect(() => {
  //   const loadTelegramSDK = () => {
  //     if (typeof window.Telegram === "undefined") {
  //       const script = document.createElement("script");
  //       script.src = "https://telegram.org/js/telegram-web-app.js";
  //       script.onload = () => {
  //         console.log("Telegram WebApp SDK loaded.");

  //         // Example usage after SDK is loaded
  //         if (typeof Telegram !== "undefined" && Telegram.WebApp) {
  //           const webApp = Telegram.WebApp;

  //           // Extract user data from initDataUnsafe
  //           const userData = webApp.initDataUnsafe?.user;
  //           // const initData = window.Telegram.WebApp.initDataUnsafe;

  //           if (userData) {
  //             // Access user properties
  //             const { first_name, last_name, username, id } = userData;

  //             webApp.ready();

  //             // I uncomment anytime i want to deploy

  //             setPeopleData((prev) => ({
  //               ...prev,
  //               firstName: first_name,
  //               userName: username,
  //               userId: id,
  //               referralCode: id,
  //             }));

  //             fetchData({
  //               firstName: first_name,

  //               userName: username,
  //               userId: id,
  //               referralCode: id,
  //             });

  //             console.log("User's first name:", first_name);
  //           } else {
  //             console.log("User data not available.");
  //           }
  //         }
  //       };
  //       script.onerror = () => {
  //         console.error("Failed to load Telegram WebApp SDK.");
  //       };
  //       document.head.appendChild(script);
  //     } else {
  //       console.log("Telegram WebApp SDK already loaded.");
  //     }
  //   };

  //   loadTelegramSDK();
  // }, []);

  // // I uncomment when testing locally
  // useEffect(() => {

  //   fetchData({
  //     firstName: "winner",
  //     userName: "samson12",
  //     userId: "344556",
  //     referralCode: "1234567",
  //   });
  // }, []);

  
  useEffect(() => {
    if (userData) {
      setPeopleData({
        firstName: userData.firstName || "loading",
        userId: userData.userId || "loading",
        referralCode: userData.userId || "loading", // Use user ID as referral code
      });
    }
  }, [userData]);


  async function fetchData(newData) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            firstName: userData.firstName,
            userId: userData.userId,
            referralCode: userData.userId,
            referredBy: refCode,
            mlcoin: balance,
            referrals: 0
          }),
        }
      );

      if (!response.ok) {
        throw new Error("failed to register");
      }

      const data = await response.json();
      console.log(data);
      setLastClaimed(new Date(data.user.lastClaimed));
      setClaimedVideos(data.user.videoIds);

      // alert(data.toString())
      setBalance(data.user.mlcoin);
    } catch (error) {
      console.log(`Fetch error: ${error.message}`);
      // setLogErr((prev) => ({
      //   two: error.message,
      // }));
    }
  }

  useEffect(() => {
    if (peopleData.userId) {
      fetchData({
        firstName: peopleData.firstName,
        userId: peopleData.userId,
        referralCode: peopleData.referralCode,
      });
    }
  }, [peopleData.userId]);

  const handleClaim = async (videoId) => {
    // if (canClaim) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId: peopleData.userId,
            videoId: videoId ? videoId : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("failed to update mlcoin");
      }

      const data = await response.json();
      setBalance(data.user.mlcoin);
      setProgress(0);

      if (videoId) {
        setClaimedVideos((prev) => [...prev, videoId]);
      }

      if (!videoId) {
        setCanClaim(false);
        setTimeout(() => {
          setCanClaim(true);
        }, 2 * 60 * 1000);
      }
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
      <div className="flex justify-between items-start bg-black mb- p-2">
        <div>
          <h1 className="text-lg font-bold text-white">
            {peopleData.firstName || "loading fn"}{" "}
            Meal
          </h1>
          <p className="text-gray-500 text-sm ">
            ID: {peopleData.userId || "loading id"}
          </p>
        </div>
        <Wallet />
      </div>

      <div className="bg-gradient-to-r from-neutral-900 to-black shadow-inner shadow-black p-3 ">
        <h2 className="text-center mb-2 font-bold text-white">
          Current Balance
        </h2>
        <div className="flex items-center justify-center gap-2 text-3xl font-bold mb-2 glow">
          <ArrowUp className="text-amber-200 bg-amber-600 rounded-full p-1" />
          <span className="text-neutral-100">{balance.toLocaleString()}</span>
          <span className="text-neutral-400 shadow-xl shadow-blue-100 hover:text-neutral-300">
            MLC
          </span>
        </div>
        <div className="bg-neutral-900 rounded-full text-center my-4 shadow-inner shadow-black inset-">
          <span className="text-white text-sm font-mono">
            EARNING RATE +42.00 MLC/hr{" "}
          </span>
        </div>

        {/* Not a component but sha  */}

        <div className="px-6 py-5 shadow-xl shadow-blue-00 mt-16 backdrop-blur-lg">

        <div>
          
        </div>
          <h2 className="text-lg text-center text-white mb-3">Next GRAB!</h2>
          <Progress value={progress} className="mb-4 bg-white text-white" />
          <div className="mx-16" style={{  filter: "brightness(90%)"}}>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleClaim(undefined)}
                disabled={!canClaim}
                className="w-full py-9 text-3xl font-bold bg-amber-500 shadow-inner shadow-gold-500 hover:bg-amber-400 transition-colors glow"
                style={{ animation: "pulse 1s infinite alternate" }}
              >
                Claim
              </Button>
            </motion.div>
          </div>
          <div className="text-center text-white font-bold font-mono mt-1 ">
          
            {/* <span>
              {loger.one}
              {loger.two}
            </span> */}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            100% { transform: scale(10.9); transform: translateX(9px);}
          }
        `}
      </style>

      <Videos
        handleClaimProps={(id) => handleClaim(id)}
        claimedVideos={claimedVideos}
      />
      {/* <Footer /> */}
    </div>
  );
}
