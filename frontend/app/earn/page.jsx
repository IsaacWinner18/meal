"use client";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Gift, PlayCircle, Share2 } from "lucide-react"
// import Image from "next/image";
// import Link from 'next/link';
import Videos from "@/components/videos";


export default function Earn() {

  // const handleClaim = async (videoId) => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },

  //         body: JSON.stringify({
  //           userId: peopleData.userId,
  //           videoId: videoId,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("failed to update mlcoin");
  //     }

  //     const data = await response.json();
  //     alert("Successfully claimed")
  //   } catch (error) {
  //     console.log(`The adeola123 error ${error}`);
  //   }
  // }
  return (
    (<div className="max-w-md mx-auto p-4 min-h-screen flex flex-col">
      <div className="flex items-center justify-between mb-3">
      <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="size-12"
          onClick={() => updatePage(1)}
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z"
            clipRule="evenodd"
          />
        </svg>
              <h1 className="text-3xl font-bold font-sans text-white">Earn MLC</h1>
      </div>
     
     <Videos />

    </div>)
  );
}

