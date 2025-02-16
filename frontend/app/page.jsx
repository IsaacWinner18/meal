"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import View from './veiw/page';

export default function Home() {
  const searchParams = useSearchParams();
  const startApp = searchParams.get("startapp");

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
                lastName: userData.last_name,
                userName: userData.username,
                userId: userData.id,
              });

              webApp.ready();

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
    {/* {userData ? <Main userData={userData} /> : <p>Loading...</p>} */}
    <View userData={userData} />
    </>
  );
}
