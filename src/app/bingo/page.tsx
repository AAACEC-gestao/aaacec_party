"use client";

import { Input } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import BingoController from "../controllers/BingoController";
import { Bingo } from "../domain/bingo";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import { JWTSigner } from "@/lib/jwt/jwt_signer";
import { AAACECRole } from "../domain/aaacec_roles";

import AddBingo from "./AddBingo";
import ModifyBingo from "./ModifyBingo";
import { Challenge } from "../domain/challenge";
import ChallengesController from "../controllers/ChallengesController";

export default function BingoPage() {
  const [guestId, setGuestId] = useState<number>(0);

  const [selectedGuest, setSelectedGuest] = useState<number>(0);

  const [bingo, setBingo] = useState<Bingo | null>(null);

  const [isWorker, setIsWorker] = useState<boolean>(false);

  const [challenges, setChallenges] = useState<Array<Challenge>>([]);

  const verifyToken = async (token: string) => {
    try {
      const tokenInformation = await JWTSigner.verify(token);
      const isValid =
        tokenInformation.role === AAACECRole.ADMIN || tokenInformation.role  === AAACECRole.WORKER;
      return isValid;
    } catch (e: any) {
        return false;
    }
  };

  useEffect(() => {
    const token = Cookies.get("token") || "";

    if (token) {
      verifyToken(token).then((isValid) => {
        setIsWorker(isValid);
      });
    } else {
      setIsWorker(false);
    }

    const lt = toast.loading("Carregando desafios...");
      ChallengesController.getChallenges().then((challenges) => {
        setChallenges(challenges);
        toast.update(lt, {
          render: "Desafios carregados com sucesso!",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        })
      })
  }, []);

  const fetchBingo = async () => {
    setSelectedGuest(guestId);
    if (guestId !== 0 && !isNaN(guestId)) {
      const lt = toast.loading("Buscando bingo...");
      try {
        const bingoData = await BingoController.getBingo(guestId);
        toast.dismiss(lt);
        setBingo(bingoData);
      } catch (error) {
        if (isWorker !== true) {
            toast.error("Erro ao buscar bingo.");
        }
        toast.dismiss(lt);
        setBingo(null);
      }
    } else {
      setBingo(null);
    }
  };

  return (
    <main className="flex items-center justify-center h-screen">
      <ToastContainer 
        position="top-right"
        autoClose={1000}
        theme="colored"
        pauseOnHover={false}
        draggable
        closeOnClick
      /> 
      <div className="flex flex-col gap-4 px-3 w-full justify-center items-center">
        <div className="flex flex-col gap-4 w-3/6 md:w-1/6 mx-auto mb-6">
          <Input
            className="w-full"
            variant="outlined"
            placeholder="ID"
            label="ID"
            type="number"
            value={guestId}
            onChange={(e) => setGuestId(parseInt(e.target.value))}
            onBlur={fetchBingo}
            crossOrigin={undefined}
          />
        </div>

        {selectedGuest !== 0 && !isNaN(selectedGuest) && (
          <>
            {bingo ? (
              <ModifyBingo setBingo={setBingo} bingo={bingo} challenges={challenges}/>
            ) : isWorker && (
              <AddBingo setBingo={setBingo} guestId={selectedGuest!} />
            )}
          </>
        )}

        <div></div>
      </div>
    </main>
  );
}
