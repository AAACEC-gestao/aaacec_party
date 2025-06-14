import BingoController from "@/app/controllers/BingoController";
import { Checkbox, Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { use, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Image from "next/image";
import AAACEC from "../../../public/AAACEC.svg"
import { Bingo } from "../domain/bingo";
import { Challenge } from "../domain/challenge";
import { JWTSigner } from "@/lib/jwt/jwt_signer";
import { AAACECRole } from "../domain/aaacec_roles";

export default function ModifyBingo({ bingo, setBingo, challenges }: { bingo: Bingo, setBingo: (bingo: Bingo) => void, challenges: Array<Challenge> }) {
    const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
    const token = Cookies.get("token") || "";
    const [role, setRole] = useState<AAACECRole | null>(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [bingoAchieved, setBingoAchieved] = useState(false);

    const handleClick = async (challenge: number, bingo: Bingo) => {
        if (bingo.completedChallenges.includes(challenge)) {
            toast.warn("Desafio já resolvido.");
            return;
        }

        setSelectedChallenge(challenge);
        handleOpen();
    }

    const handleOpen = async () => {
        setModalOpen(!modalOpen);
    }

    const handleConfirm = async () => {
        if (selectedChallenge === null) return;

        const solved = await BingoController.solveChallenge(token, bingo.guest, selectedChallenge);
        if (solved.status === 200) {
            const updatedChallenges = [...bingo.completedChallenges, selectedChallenge];

            if (!bingoAchieved) {
                const card = bingo.card;
    
                // Check every row for 5 completed challenges
                for (let row = 0; row < card.length; row++) {
                    if (card[row].every(challenge => {
                        if (challenge == -1 ) return true; // Skip the center cell
    
                        return updatedChallenges.includes(challenge);
                    })) {
                        setBingoAchieved(true);
                        break;
                    }
                }
    
                // Check every column for 5 completed challenges if no bingo on rows
                if (!bingoAchieved) {
                    for (let col = 0; col < card[0].length; col++) {
                        let colComplete = true;
                        for (let row = 0; row < card.length; row++) {
                            if (!updatedChallenges.includes(card[row][col])) {
                                colComplete = false;
                                break;
                            }
                        }
                        if (colComplete) {
                            setBingoAchieved(true);
                            break;
                        }
                    }
                }
    
                if (bingoAchieved) {
                    toast.success("Linha ou coluna completa.", {
                        autoClose: 7000,
                        
                    });
                }
            }

            if (updatedChallenges.length === 25) {
                toast.success("Bingo completo! Parabéns!", {
                    autoClose: 7000,
                });
            }

            setBingo({
                ...bingo,
                completedChallenges: [...bingo.completedChallenges, selectedChallenge],
            });
        } else {
            toast.error("Erro ao resolver o desafio.");
        }
        handleOpen();
    }

    useEffect(() => {
        const getRole = async () => {
            try {
                const tokenInformation = await JWTSigner.verify(token);
                setRole(tokenInformation.role);
            } catch (e) {
                setRole(null);
            }
        }

        getRole();
    }, [token]);

    return (
        <div>
            <Dialog open={modalOpen} handler={handleOpen}>
                <DialogHeader>Desafio #{selectedChallenge}</DialogHeader>
                <DialogBody>
                    {challenges.find(challenge => challenge.numericId === selectedChallenge)?.description}
                </DialogBody>
                <DialogFooter>
                <Button
                    onClick={handleOpen}
                    className="mr-1"
                >
                    <span>Cancelar</span>
                </Button>
                {role && [AAACECRole.WORKER, AAACECRole.ADMIN].includes(role) && (
                    <Button className="bg-green text-black" variant="filled" onClick={handleConfirm}>
                        <span>Confirmar</span>
                    </Button>
                )}
                </DialogFooter>
            </Dialog>
            <table className="w-4/6 mx-auto border-separate border-spacing-2">
                <tbody>
                    {bingo.card.map((_, rowIdx) => (
                        <tr key={rowIdx} className="flex justify-center">
                            {bingo.card[rowIdx].map((_, colIdx) => (
                                <td
                                    key={colIdx}
                                    className="w-16 h-16 bg-white rounded-lg m-1 flex items-center justify-center shadow-md border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    { (rowIdx === 2 && colIdx === 2) ?
                                        <Image src={AAACEC} alt="AAACEC Logo" width={50} />
                                    :
                                        <button
                                            className="relative w-full h-full flex items-center justify-center"
                                            onClick={() => {handleClick(bingo.card[rowIdx][colIdx], bingo)}}
                                        >
                                            { bingo.completedChallenges.includes(bingo.card[rowIdx][colIdx]) && <XMarkIcon className="absolute w-10 h-10 text-gray" /> }
                                            <span className="text-center">{bingo.card[rowIdx][colIdx]}</span>
                                        </button>
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}