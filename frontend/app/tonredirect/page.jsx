"use client";
import { useEffect } from "react";
import Loader from "../loader/page";
export default function TonRedirect() {
  useEffect(() => {
    const param = new URLSearchParams(window.location.search)
    const amount = param.get('amount')

    if (amount) {
        window.location.href = `ton://transfer/UQDE7SRvOuBokRenwICsFw3XOUWcx1SYiHKu_ssrewOQfEtW?amount=${amount}&text=Transfer`;
    }
  }, []);

  return (
    <Loader />
  );
}
