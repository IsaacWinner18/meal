"use client"
import { useState, useEffect } from "react";
import { ChevronRight, Play, SquareCheckBig, CircleCheck } from "lucide-react"
import Link from "next/link";
import Image from "next/image";


export default function TaskComp({handleClaimProps = () => {}, claimedTasks = [] }) {
 
  
  
  const [tasks, setTasks] = useState([]);


    const taskFunc = async () => {
        const responseTask = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tasks`
        );
        if (!responseTask.ok) throw Error("Something went wrong");
        const { data } = await responseTask.json();
        setTasks(data);
      };

      useEffect(() => {
        taskFunc()
      }, [])

  

    
    return (

<div className="min-h-screen bg-[#121212] text-white p-2">
      <h1 className="text-xl font-bold mb-6">Tasks</h1>

      <div className="space-y-4 mb-24">

        {tasks.map((task) => {
          const taskClaimed = claimedTasks.includes(task._id);
          return (
            <Link rel="noopener noreferrer" target="_blank" key={task._id}  href={task.taskUrl}>
          <div
            onClick={() => handleClaimProps(task._id)}
            className="flex items-center bg-[#1e1e1e] rounded-lg p-3 cursor-pointer hover:bg-[#2a2a2a] transition-colors"
          >
            <div className="relative h-16 w-16 flex-shrink-0 mr-3">
              <div className="absolute inset-0 bg-[#2a2a2a] rounded-md overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-md bg-black bg-opacity-80 flex items-center justify-center">
                        <SquareCheckBig className="w-5 h-5 text-amber-600 fill-current" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-white">{task.taskInfo}</h3>
              <div className="flex items-center mt-1">
                {/* <div className="w-5 h-5 rounded-full bg-yellow-400 mr-2"></div> */}
                <Image alt="mealcoin" src="https://res.cloudinary.com/dkfmaqtpy/image/upload/v1741712631/mealcoin-logo_avicx0.png" width={20} height={20} className="mr-2"/>
                <span className="text-sm text-gray-400">{task.coin}</span>
              </div>
            </div>
{taskClaimed ?
 ( <CircleCheck className="w-5 h-5 text-gray-400" />) :
 ( <ChevronRight className="w-5 h-5 text-gray-400" />) 

}
          </div>

          </Link>
          );
        })}

      </div>
    </div>
  );
}
