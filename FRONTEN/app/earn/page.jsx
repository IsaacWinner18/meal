import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, PlayCircle, Share2 } from "lucide-react"
import Image from "next/image";
import Link from 'next/link';

export default function Earn() {
  return (
    (<div className="max-w-md mx-auto p-4 min-h-screen flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <Link href="/">
        <Image src="/back-buttons-multimedia-svgrepo-com.svg" alt="svg back in earn" width={50} height={50} />
        </Link>
      <h1 className="text-3xl font-bold font-mono">Earn MLC</h1>

      </div>
      <div className="grid gap-4">
        <Card className="bg-gradient-to-b from-neutral-200 to-green-600 border-fuchsia-500/50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-600 gap-2">
              <PlayCircle className="text-white" />
              Watch Videos
            </CardTitle>
            <CardDescription>Earn up to 50 MLC per video watched</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-600 hover:bg-blue-400">
              Start Watching
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-neutral-200 to-green-600 border-fuchsia-500/50">
          <CardHeader>
            <CardTitle className="flex items-center text-fuchsia-500 gap-2">
              <Gift className="text-green-400" />
              Daily Bonus
            </CardTitle>
            <CardDescription>Claim your daily reward of 200 MLC</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-fuchsia-500 hover:bg-fuchsia-600">
              Claim Bonus
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-neutral-200 to-green-600 border-fuchsia-500/50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-600 gap-2">
              <Share2 className="text-blue-600" />
              Share & Earn
            </CardTitle>
            <CardDescription>Share with friends and earn 100 MLC per referral</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-green-400 hover:bg-fuchsia-600">
              Share Now
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>)
  );
}

