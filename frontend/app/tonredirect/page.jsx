import { useEffect } from "react";
import Loader from "../loader/page";
export default function TonRedirect() {
  useEffect(() => {
    window.location.href = "ton://transfer/UQDE7SRvOuBokRenwICsFw3XOUWcx1SYiHKu_ssrewOQfEtW?amount=100000000&text=Transfer";
  }, []);

  return (
    <Loader />
  );
}
