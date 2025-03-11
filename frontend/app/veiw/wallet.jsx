"use client";
import { TonConnectUI } from "@tonconnect/ui";
import { useState, useEffect } from "react";
import { Address } from "@ton/core";

let tonConnectUIInstance = null;

export default function Wallet() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!tonConnectUIInstance) {
        tonConnectUIInstance = new TonConnectUI({
          manifestUrl: "https://res.cloudinary.com/dkfmaqtpy/raw/upload/v1741105016/tonconnect-manifest_igpbk0.json",
        });
      }
      const savedAddress = localStorage.getItem("savedWalletAddress");
      if (savedAddress) {
        const friendlyAddress = Address.parse(savedAddress).toString({ urlSafe: true });
        const shortenedAdd = `${friendlyAddress.slice(0, 3)}..${friendlyAddress.slice(-3)}`;
        setWalletAddress(shortenedAdd);
      }

      const unsubscribe = tonConnectUIInstance.onStatusChange((wallet) => {
        if (wallet?.account) {
          const rawAddress = wallet.account.address;
          localStorage.setItem("savedWalletAddress", rawAddress);
          const friendlyAddress = Address.parse(rawAddress).toString({ urlSafe: true });
          const shortenedAdd = `${friendlyAddress.slice(0, 3)}..${friendlyAddress.slice(-3)}`;
          setWalletAddress(shortenedAdd);
        } else {
          setWalletAddress(null);
          localStorage.removeItem("savedWalletAddress");
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

  const handleWalletClick = async () => {
    if (tonConnectUIInstance) {
      if (walletAddress) {
        setShowConfirmDialog(true);

      } else {
        await tonConnectUIInstance.openModal();
      }
    }
  };

  const handleConfirm = async () => {
    if (tonConnectUIInstance) {  
        await tonConnectUIInstance.disconnect();
        setWalletAddress(null);
        localStorage.removeItem("savedWalletAddress");
    }
    setShowConfirmDialog(false);
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div onClick={handleWalletClick} className="flex flex-col justify-center items-center">
        <div>
          <button>
            <div className="glow rounded-lg shadow-xl shadow-amber-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="size-10"
              >
                <path d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0A.75.75 0 0 0 9 9H5.25Z" />
              </svg>
            </div>
          </button>
        </div>
        <div>
          <p className="text-white">{walletAddress ? `${walletAddress}` : "Connect"}</p>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed top-20 inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-12 rounded-lg shadow-lg">
            <p>Do you want to disconnect?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={handleCancel} className="px-6 py-4 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleConfirm} className="px-6 py-4 bg-blue-600 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
