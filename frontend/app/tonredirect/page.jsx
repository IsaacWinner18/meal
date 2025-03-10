"use client";
import { useEffect } from "react";
import Loader from "../loader/page";


export default function TonRedirect() {

  useEffect(() => {
    const param = new URLSearchParams(window.location.search)
    const amount = param.get('amount')
    const userId = param.get('userId')

    if (amount && userId) {
        // window.location.href = `ton://transfer/UQDE7SRvOuBokRenwICsFw3XOUWcx1SYiHKu_ssrewOQfEtW?amount=${amount}&text=${userData?.userId}`;

        window.location.href = `ton://transfer/0QDMoTcRiP_ciARdO2CFDvAlZ_-V70wyVl4w2na66b_oHjzV?amount=${amount}&text=${userId}`;
    }

    setTimeout(() => {
      window.location.href = "https://t.me/mealcoinbot/mealcoin";
    }, 7000);
  }, []);

  return (
    <>
    <Loader />
    
    </>
  );
}
