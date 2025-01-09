"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Footer from "@/components/Footer";

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [progress, setProgress] = useState(0);
  const [canClaim, setCanClaim] = useState(true);

  const [peopleData, setPeopleData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    userId: ""
  })

 

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

              setPeopleData(prev => ({...prev, 
                firstName: first_name, 
                lastName: last_name,
                userName: username,
                userId: id
              }))
              console.log("User's first name:", first_name);
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

  const fetchData = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          firstName: peopleData.firstName,
          lastName: peopleData.lastName,
          usernamedb: peopleData.userName,
          mlcoin: balance,
        }),
      });
      if (!response.ok) {
        console.log(` this is the api url: ${process.env.NEXT_PUBLIC_API_URL}`)
        throw new Error("failed to register");
      }
      const data = await response.json();
      console.log(data.user.mlcoin);
      setBalance(data.user.mlcoin);
    } catch (error) {
      console.log(`Fetch error: ${error.message}`);
    }
  };

  const handleClaim = async () => {
    if (canClaim) {
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
        }, 600); // Reset after 5 seconds
      } catch (error) {
        console.log(`The adeola ${error}`);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!canClaim) {
      const interval = 600;
      const increment = 100 / (600 / interval);

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
  }, [canClaim]);

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-1">
      <div className="flex justify-between items-start mb-4 p-2">
        <div>
          <h1 className="text-lg font-bold">
            {peopleData.firstName || "loading"} {peopleData.lastName || "loading"}
          </h1>
          <p className="text-gray-500 text-sm shadow-xl shadow-neutral-300">
            ID: {peopleData.userId || "loading"}
            <i className="hidden">{peopleData.userName}</i>
          </p>
        </div>
        <div className="rounded-lg shadow-xl shadow-green-700">
          {/* <Flame className="text-blue-600" size={24} /> */}
          <Image src="/wallet.gif" alt="Wallet.gif" width={45} height={45} />
        </div>
      </div>

      <div className="bg-gradient-to-r from-neutral-200 to-green-400 shadow-inner shadow-green-800 rounded-3xl p-3 ">
        <h2 className="text-center mb-2 font-bold">Current Balance</h2>
        <div className="flex items-center justify-center gap-2 text-3xl font-bold mb-2">
          <ArrowUp className="text-blue-200 bg-green-600 rounded-full p-1" />
          <span className="text-neutral-800">{balance}</span>
          <span className="text-neutral-200 shadow-xl shadow-blue-100 hover:text-neutral-300">
            MLC
          </span>
        </div>
        <div className="bg-green-300 rounded-full text-center my-4 shadow-inner shadow-green-600 inset-">
          <span className="text-blue-950 text-xs font-mono">
            EARNING RATE +400.00 MLC/hr{" "}
          </span>
        </div>

        {/* Not a component but sha  */}

        <div className="bg-gradient-to-t from-green-400 to-white rounded-3xl px-6 py-5 shadow-xl shadow-blue-00 mt-16">
          <h2 className="text-lg text-center mb-3">Next GRAB!</h2>
          <Progress value={progress} className="mb-4" />
          <div className="mx-16">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleClaim}
                disabled={!canClaim}
                className="w-full py-6 text-xl bg-green-700 shadow-inner shadow-green-200 hover:bg-green-600 transition-colors"
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
            <span> Available</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
