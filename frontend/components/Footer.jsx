import Image from "next/image";
import Link from "next/link"


export default function Footer() {

    return (
        <div className=' text-white mt-7 mb-2 py-2 bg-green-400 rounded-full shadow-xl shadow-green-800 font-mono absolute bottom-0 left-0 w-full'>
  <div className='flex justify-between mx-10 '>

      <button className="">
        <Link href="/" className="flex flex-col items-center">
          <p><Image src="/real-estate-unscreen.gif" alt='home' width={40} height={40} unoptimized={true} /></p>
          <p className='text-xs'>HOME</p>
        </Link>
      </button>


      <button className="">
        <Link href="/earn" className="flex flex-col items-center">
          <p><Image src="/earn-money-unscreen.gif" alt='hi' width={40} height={40} unoptimized={true} /></p>
          <p className='text-xs'>EARN</p>
        </Link>
      </button>
      <button className="">
        <a href="/invite" className="flex flex-col items-center">
          <p><Image src="/add-user-unscreen.gif" alt='hi' width={40} height={40} unoptimized={true} /></p>
          <p className='text-xs'>INVITE</p>
        </a>
      </button>
      </div>
    </div>
    )
} 

