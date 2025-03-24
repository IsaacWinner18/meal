"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import Tasks from "@/components/tasks";
import Wallet from "./wallet";
import Image from "next/image";
import SpaceAnimation from "@/app/veiw/space-animation";




export default function View({ userData, refCode }) {

  const [balance, setBalance] = useState(0);
  const [canClaim, setCanClaim] = useState(true);
  const [lastClaimed, setLastClaimed] = useState(null);
  const [progress, setProgress] = useState(0);

  const [peopleData, setPeopleData] = useState({
    firstName: "",
    userId: "",
    referralCode: "",
  });
  
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLastClaimed = localStorage.getItem("lastClaimed");
      console.log(storedLastClaimed)
      const storedProgress = localStorage.getItem("progress");
      if (storedLastClaimed) {
        setLastClaimed(storedLastClaimed);
      }
      if (storedProgress) {
        setProgress(Number(storedProgress));
      }
    }
  }, []);


  const handleClaimtwo = () => {
    if (isAnimating) return
    setIsAnimating(true)

    // Reset animation after 3 seconds
    setTimeout(() => {
      setIsAnimating(false)
    }, 3000)
  }

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
    alert("FETCHING")
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


  const handleClaim = async () => {
    // if (canClaim) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ userId: peopleData.userId }),
        }
      );

      if (!response.ok) {
        throw new Error("failed to update mlcoin");
      }

      const data = await response.json();
      setBalance(data.user.mlcoin);
      setProgress(0);
      localStorage.setItem("progress", "0");

       setCanClaim(false);

      const dateinit = new Date(data.lastClaimed);

      setLastClaimed(dateinit)
      console.log(dateinit)
      localStorage.setItem("lastClaimed", dateinit);
      funcUsedInTask(data)
      console.log('last claimed:', new Date(data.lastClaimed) )
     
      clearLocal()
    } catch (error) {
      console.log(`The adeola error ${error}`);
    }
  };

  const funcUsedInTask = (data) => {
    setBalance(data.user.mlcoin);
  }

  useEffect(() => {
    if (lastClaimed) {
      const interval = 1000;
      const date1 = new Date(lastClaimed);
      const date2 = new Date();

      const differenceInMinutes =
        (date2.getTime() - date1.getTime()) / (1000 * 60);

        const claimCooldownMinutes = 2; // 2 minutes cooldown

      const increment = 100 / ((claimCooldownMinutes * 60 * 1000) / interval);

      if (differenceInMinutes >= claimCooldownMinutes) {
        setCanClaim(true);
      setProgress(100);
      localStorage.setItem("progress", "100");

      } else {
        setCanClaim(false);

        const remainingTime = claimCooldownMinutes * 60 - differenceInMinutes * 60;


        const initialProgress = (differenceInMinutes / claimCooldownMinutes) * 100;


        setProgress(initialProgress);

        localStorage.setItem("progress", initialProgress.toString());


        const timer = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(timer);
              setCanClaim(true);
              localStorage.setItem("progress", "100");
              return 100;
            }

            const newProgress = prev + increment;
            localStorage.setItem("progress", newProgress.toString());
            return newProgress;

          });
        }, interval);
        return () => clearInterval(timer);
      }
    }
  }, [lastClaimed]);

  const clearLocal = () => {
    localStorage.removeItem("progress");
  }

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
          <span className="text-neutral-400 shadow-xl shadow-amber-100 hover:text-neutral-300">
            MLC
          </span>
        </div>
        <div className="flex justify-center items-center ">
          <Image src="https://res.cloudinary.com/dkfmaqtpy/image/upload/v1741712631/mealcoin-logo_avicx0.png" alt="mealcoin-logo" width={60} height={30} />

        </div>
        <div className="bg-neutral-900 rounded-full text-center my-4 shadow-inner shadow-black inset-">
          <span className="text-white text-sm font-mono">
            EARNING RATE +1000.00 MLC/day 
             {" "}
          </span>
        </div>

        {/* Not a component but sha  */}

        <div className="px-6 shadow-xl shadow-blue-00 mt-1 backdrop-blur-lg">

        <div>
          
        </div>
          <h2 className="text-lg text-center text-white mb-3 font-mono">Next GRAB!</h2>
        
          <div className="mb-5" style={{ width: "100%", height: "14px", background: "#ddd", borderRadius: "10px", overflow: "hidden" }}>

  <div value={progress}
    style={{
      width: `${progress}%`,
      height: "100%",
      background: "#ff5722", // Change this color
      transition: "width 0.5s ease-in-out"
    }}
  />
</div>

          <div className="mx-16" style={{  filter: " blur(0.3px) brightness(90%)"}}>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => {

                  handleClaim(undefined);
                  handleClaimtwo();
                }
                }
                disabled={!canClaim}
                
                className="w-full py-9 text-3xl font-bold bg-gradient-to-r from-amber-500 shadow-inner shadow-gold-500 hover:bg-amber-400 transition-colors glow"
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

      <Tasks userData={userData} funcUsedInTask={funcUsedInTask} />
      {/* <Footer /> */}
      <SpaceAnimation isAnimating={isAnimating} />
    </div>
  );
}
