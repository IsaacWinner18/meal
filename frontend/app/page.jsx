"use client";

import { useState, useEffect } from "react";
import View from "./veiw/page";
import Invite from "./invite/page";
import Footer from "@/components/Footer";
import Earn from "./earn/page";

export default function Home() {
  const [pageState, setPageState] = useState(1);
  const [refCode, setRefcode] = useState(null)
  const [userData, setUserData] = useState(null);

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
                userName: userData.username,
                userId: userData.id,
              });

              webApp.ready();

              let startParam = window.Telegram.WebApp.initDataUnsafe.start_param
              if (startParam) setRefcode(startParam)

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

  return (
    <>
      <p>{refCode}</p>
      
      { userData ? <>
      {pageState === 1 && <View userData={userData} refCode={refCode} />}
      {/* {<View userData={userData} />} */}
      {pageState === 2 && <Earn updatePage={setPageState} />}
      {pageState === 3 && <Invite updatePage={setPageState} />}
      {pageState === 1 && <Footer updatePage={setPageState} />}</>: (
      <p>Loading...</p>) }

    </>
  );
}
