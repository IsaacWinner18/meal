"'use client'"

import { Home, DollarSign, Users } from "'lucide-react'"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Layout({
  children
}) {
  const pathname = usePathname()

  return (
    (<div className="min-h-screen bg-[#1a1f2e] text-white flex flex-col">
      {children}
      <nav className="mt-auto fixed bottom-0 left-0 right-0 bg-[#2a1f3d] p-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              pathname === "/" ? "text-fuchsia-400" : "text-gray-400 hover:text-fuchsia-300"
            }`}>
            <Home size={24} />
            <span className="text-xs">HOME</span>
          </Link>
          <Link
            href="/earn"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              pathname === "/earn" ? "text-fuchsia-400" : "text-gray-400 hover:text-fuchsia-300"
            }`}>
            <DollarSign size={24} />
            <span className="text-xs">EARN</span>
          </Link>
          <Link
            href="/invite"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              pathname === "/invite" ? "text-fuchsia-400" : "text-gray-400 hover:text-fuchsia-300"
            }`}>
            <Users size={24} />
            <span className="text-xs">INVITE</span>
          </Link>
        </div>
      </nav>
    </div>)
  );
}

