"use client";

import { JWTSigner } from "@/lib/jwt/jwt_signer";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AAACECRole } from "../domain/aaacec_roles";
import { useRouter } from "next/navigation";

export default function ByPassLogin(WrappedComponent: () => JSX.Element) {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
      const verifyToken = async () => {
        const token = Cookies.get("token") || "";
        try {
          const tokenInformation = await JWTSigner.verify(token);
          if (tokenInformation.role === AAACECRole.CONCIERGE) {
            router.replace("/concierge");
          }
          if (tokenInformation.role === AAACECRole.ADMIN) {
            router.replace("/3d/worker");
          }
          if (tokenInformation.role === AAACECRole.WORKER) {
            router.replace("/3d/worker");
          }
        } catch (error) {
          setLoading(false);
        }
      };
      verifyToken();
    }, []);

    return loading ? <div>Loading</div> : <WrappedComponent {...props} />;
  };
  return Wrapper;
}
