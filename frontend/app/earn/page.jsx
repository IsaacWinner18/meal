"use client";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Gift, PlayCircle, Share2 } from "lucide-react"
// import Image from "next/image";
// import Link from 'next/link';
import Videos from "@/components/videos";

export default function Earn({ updatePage }) {
  const [error, setError] = useState('');

  const handleTransfer = () => {
    setError('');

    // const deepLinkURL = "tonkeeper://transfer?recipient=UQDE7SRvOuBokRenwICsFw3XOUWcx1SYiHKu_ssrewOQfEtW=10&comment=Transfer%20Fund";
    
    const deepLinkURL = "ton://transfer/<address>?amount=2000&text=Transfer%20Fund";
    window.location.href = deepLinkURL;

    setTimeout(() => {
      setError('It seems your wallet is not installed or the transaction was cancelled. Please try again.');
    }, 2000);
  };

  const cards = [
    { id: 1, name: "DOTMO25-40,000", image: "https://res.cloudinary.com/dkfmaqtpy/image/upload/v1741039906/donald-bot1_dphe2y.jpg", ton: "0.6", stars: "18" },
    { id: 2, name: "ELMK-35,000", image: "https://res.cloudinary.com/dkfmaqtpy/image/upload/v1741039906/elon-bot1_usq2sw.jpg", ton: "0.5", stars: "16" },
    { id: 3, name: "APAM-20,000", image: "https://res.cloudinary.com/dkfmaqtpy/image/upload/v1741039906/ape-bot1_kzpd2h.jpg", ton: "0.4", stars: "14" },
    { id: 4, name: "DEQK-10,000", image: "https://res.cloudinary.com/dkfmaqtpy/image/upload/v1741039906/death-bot1_jydsgf.jpg", ton: "0.3", stars: "11" },
    { id: 5, name: "OPPM-10,000", image: "https://res.cloudinary.com/dkfmaqtpy/image/upload/v1741039907/optimus-bot4_t1lxqx.jpg", ton: "0.3", stars: "11" },
    { id: 6, name: "BUAR-5,000", image: "https://res.cloudinary.com/dkfmaqtpy/image/upload/v1741039907/optimus-bot3_nqycpo.jpg", ton: "0.2", stars: "9" },
    // { id: 7, name: "Item Seven", image: "/image7.png", ton: "0.5", stars: "3" },
    // { id: 8, name: "Item Eight", image: "/image8.png", ton: "0.5", stars: "3" },
  ];  


  return (
    <div className="max-w-md min-h-screen flex flex-col mb-6">
      <div className="flex items-center justify-between p-3">
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
        {/* <h1 className="text-3xl font-bold font-sans text-white">Earn</h1> */}
      </div>

<div className="text-white ml-4">Buy Custom Rare Givers to increase earning💎</div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 px-2">
            {cards.map((card) => (
        <div key={card.id} className="p-1 bg-gray-900 rounded-2xl shadow-lg">
          <img
            src={card.image}
            alt={card.name}
            className="w-full h-auto rounded-lg"
            width={1120}
            height={1120}
          />
          <div className="px-2">

          <h2 className="mt-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-purple-300 to-blue-400">
            {card.name}
          </h2>
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-300 flex items-center">
              <span className="mr-1">💎</span> {card.ton}
            </p>
            <p className="text-gray-300 flex items-center">
              <span className="mr-1">⭐</span> {card.stars}
            </p>
          </div>
          <button onClick={() => {
            if(card.id === 1) {
              handleTransfer();
            }
          }} className="my-4 w-20 bg-blue-500 text-white py-2 rounded-xl text-sm font-semibold shadow-lg transition transform hover:scale-105 glow-effect">
            Buy Now
          </button>
          </div>
        </div>
      ))}
      </div>
 
    </div>
  );
}
