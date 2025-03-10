"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Trophy } from "lucide-react";
import { ToastProvider, useToast, CopyButton } from "./toast"
import { useState, useEffect } from "react";

export default function Invite({ updatePage, userData }) {
  const { showToast } = useToast()
  const [count, setCount] = useState(0);

  async function getCount() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userData?.userId, firstName: userData?.firstName }),
    });
    const data = await response.json();
    console.log(data)
    setCount(data.user.referrals);
  }

  useEffect(() => {
    if (userData?.userId) {
      getCount();
    }
  }, [userData]);
  
  const referralLink = `https://t.me/mealcoinbot/mealcoin?startapp=${userData?.userId}`;
  
  const shareOnTelegram = () => {
    const referralText = `Hey! I just joined MealCoin and I'm loving it. You should join too!`;
    const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(referralText)}`;
    Telegram.WebApp.openTelegramLink(fullUrl);
  };

const copyLinkToClipboard = async () => {
  try {
  await navigator.clipboard.writeText(referralLink)
  showToast("Link copied to clipboard")
} catch (error) {
  console.log("Failed to copy link to clipboard")
}
}


  return (
    <div className="max-w-md mx-auto p-4 min-h-screen flex flex-col">
      <div className="flex items-center justify-between mb-3">
        {/* <Link href="/"> */}
        {/* <Button onClick={() => updatePage(1)}>1</Button> */}
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
        {/* </Link> */}
        <h1 className="text-3xl font-bold font-sans text-white">
          Invite Friends
        </h1>
      </div>
      <Card className="bg-green border-white mb-6">
        <CardHeader>
          <CardTitle className="text-blue-700">Your Referral Code</CardTitle>
          <CardDescription className="text-white opacity-55">
            Share this Link with friends to earn rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="bg-blue-600 text-white p-3 rounded-lg flex-1 text-center font-mono overflow-x-scroll">
              {`https://t.me/mealcoinbot/mealcoin?startapp=${userData?.userId}`}
            </div>
            <Button onClick={copyLinkToClipboard} variant="outline" size="icon" className="shrink-0">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-green border-white mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-white" />
            <p className="text-blue-700">Rewards</p>
          </CardTitle>
          <CardDescription className="text-white opacity-60">
            Earn for every friend who joins..
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-white">Per Referral</span>
            <span className="text-blue-500 font-bold">10 MLC</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white">Total Referrals</span>
            <span className="text-blue-500 font-bold">{count}</span>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4">
        <Button onClick={shareOnTelegram} className="w-full bg-blue-500 hover:bg-blue-600">
          <Share2 className="mr-2 h-4 w-4" />
          Share via Social Media
        </Button>
        <Button onClick={copyLinkToClipboard} variant="outline" className="w-full text-blue-400">
          <Copy className="mr-2 h-4 w-4" />
          Copy Invite Link
        </Button>
      </div>
    </div>
  );
}
