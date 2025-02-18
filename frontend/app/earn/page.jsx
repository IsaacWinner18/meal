// "use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, PlayCircle, Share2 } from "lucide-react"
import Image from "next/image";
import Link from 'next/link';
import Videos from "@/components/videos";


export default function Earn() {

  const handleClaim = async (videoId) => {
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
            videoId: videoId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("failed to update mlcoin");
      }

      const data = await response.json();
      alert("Successfully claimed")
    } catch (error) {
      console.log(`The adeola123 error ${error}`);
    }
  }
  return (
    (<div className="max-w-md mx-auto p-4 min-h-screen flex flex-col">
      <div className="flex items-center justify-between mb-3">
              <h1 className="text-3xl font-bold font-sans text-white">Earn MLC</h1>
      </div>
     
     <Videos />

    </div>)
  );
}

