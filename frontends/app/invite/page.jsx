import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Share2, Trophy } from "lucide-react"

import Link from "next/link";
import Image from "next/image";

export default function Invite() {
  return (
    (<div className="max-w-md mx-auto p-4 min-h-screen flex flex-col">

      <div className="flex items-center justify-between mb-3">
      <Link href="/">
        <Image src="/back-buttons-multimedia-svgrepo-com.svg" alt="svg back in earn" width={50} height={50} />
        </Link>
      <h1 className="text-3xl font-bold ">Invite Friends</h1>

      </div>
      <Card className="bg-green border-white mb-6">
        <CardHeader>
          <CardTitle className="text-green-700">Your Referral Code</CardTitle>
          <CardDescription className="text-white opacity-60">Share this code with friends to earn rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="bg-green-600 text-white p-3 rounded-lg flex-1 text-center font-mono">
              WINNER123
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-green border-fuchsia-500/50 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-white" />
            <p className="text-green-700">Rewards</p>
          </CardTitle>
          <CardDescription className="text-white opacity-60">Earn for every friend who joins..</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-white">Per Referral</span>
            <span className="text-green-900 font-bold">100 MLC</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white">Total Earned</span>
            <span className="text-green-900 font-bold">500 MLC</span>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4">
        <Button className="w-full bg-green-500 hover:bg-green-600">
          <Share2 className="mr-2 h-4 w-4" />
          Share via Social Media
        </Button>
        <Button variant="outline" className="w-full text-green-400">
          <Copy className="mr-2 h-4 w-4" />
          Copy Invite Link
        </Button>
      </div>

   
    </div>)
  );
}

