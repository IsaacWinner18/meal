"use client";

import { useState, useEffect } from "react";
import View from "./veiw/page";
import Invite from "./invite/page";
import Footer from "@/components/Footer";
import Earn from "./earn/page";
import Image from "next/image";
import { ToastProvider, useToast, CopyButton } from "../app/invite/toast"
import Loader from "./loader/page";
// import TonRedirect from "./tonredirect/page";


export default function Home() {
  const [pageState, setPageState] = useState(1);
  const [refCode, setRefcode] = useState(null)
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [delayedUserData, setDelayedUserData] = useState(null);

  useEffect(() => {
    if(!userData) return;

    const timer = setTimeout(() => {
      setDelayedUserData(userData);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer)
  }, [userData]);

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
              setUserData({
                firstName: userData.first_name,
                userId: userData.id,
              });


              webApp.ready();

              let startParam = window.Telegram.WebApp.initDataUnsafe.start_param
              if (startParam) setRefcode(Number(startParam))

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

  // useEffect(() => {
  //   setUserData({
  //     firstName: " Winner ",
  //     userId: 409876,
  //   });
  // }, [])
  // useEffect(() => {
  //   setRefcode(234567)
  // }, [])
 // console.log("This is the userData", userData)

  return (
    <>
     {loading || !delayedUserData ? (
        <Loader /> 
      ) : (

    <>
      {pageState === 1 && <View userData={userData} refCode={refCode} />}
      {pageState === 2 && <Earn updatePage={setPageState} userData={userData} />}
      <ToastProvider>
      {pageState === 3 && <Invite updatePage={setPageState} userData={userData} />}
      </ToastProvider>
      {pageState === 1 && <Footer updatePage={setPageState} />}
      {/* {pageState === 4 && <TonRedirect updatePage={setPageState} userData={userData}/>} */}
      </> 
      )}
      
    </>
  );
}
