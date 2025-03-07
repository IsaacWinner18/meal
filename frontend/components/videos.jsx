"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Gift, PlayCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";



export default function videoComp({handleClaimProps = () => {}, claimedVideos = [] }) {

  // const { handleClaimProps, claimedVideos } = handle;
  // console.log("handleClaimProps:", handleClaimProps);
  // console.log("claimedVideos:", claimedVideos);
  
  
  const [videos, setVideos] = useState([]);
  


    const videoFunc = async () => {
        const responseVideo = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/videos`
        );
        if (!responseVideo.ok) throw Error("Something went wrong");
        const { data } = await responseVideo.json();
        setVideos(data);
      };

      useEffect(() => {
        videoFunc()
      }, [])

    
    return (
        <div className="mb-28">

        {videos.map((video) => {
          const videoClaimed = claimedVideos.includes(video._id);
          return (
            
            <Link rel="noopener noreferrer" target="_blank" key={video._id}  href={video.videoUrl} className={videoClaimed ? 'hidden' : 'block'}>
            <Card
           
              className="bg-gradient-to-b from-neutral-800 to-black border-black mx-2 mt-2 mb-6"
            >
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600 gap-2">
                  <PlayCircle className="text-white" />
                  Watch Videos
                </CardTitle>
                <CardDescription>
                  Earn up to {video.coin} MLC per video watched
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => {
                    // Redirect to the video
                    handleClaimProps(video._id);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-400 "
                  disabled={videoClaimed}
                  >
                      {videoClaimed ? 'Start Watching' : 'Start Watching'}
                      </Button>
              </CardContent>
            </Card>
             </Link>
          );
        })}
      </div>
    )
}