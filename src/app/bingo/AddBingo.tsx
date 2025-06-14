import BingoController from "@/app/controllers/BingoController";
import ChallengesController from "@/app/controllers/ChallengesController";
import BingoGenerator from "@/lib/bingo_generator";
import { Checkbox, Button } from "@material-tailwind/react";
import { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Bingo } from "../domain/bingo";


export default function AddBingo({ guestId, setBingo }: { guestId: number, setBingo: (bingo: Bingo) => void }) {
    const [tags, setTags] = useState<string[]>(["alcoolico", "pegacao"]);

    const token = Cookies.get("token") || "";

    const getBingoCard = async (tags: string[]): Promise<number[][]> => {
        return await ChallengesController.getChallengesByTags(tags).then((challenges) => {
            const easyChallenges = challenges.get(1)?.map((c) => c.numericId) || [];
            const mediumChallenges = challenges.get(2)?.map((c) => c.numericId) || [];
            const hardChallenges = challenges.get(3)?.map((c) => c.numericId) || [];

            return BingoGenerator.generateBingoCard(easyChallenges, mediumChallenges, hardChallenges);
        }).catch((error) => {
            console.error("Erro ao carregar desafios:", error);
            toast.error("Erro ao carregar desafios.");
            return [[]];
        });
    }

    const addBingo = async () => {
        try {
            const bingoCard = await getBingoCard(tags);
            const bingo = await BingoController.addBingo(token, "025saologin", guestId, bingoCard);
            setBingo(bingo);
            toast.success("Bingo criado com sucesso!");
        } catch (error) {
            toast.error("Erro ao criar bingo.");
        }
    };

    const toggleTag = (e: any) => {
        let newTags: string[] = [];

        if (e.target.checked) {
            newTags = [...tags, e.target.value];
        } else {
            newTags = tags?.filter((tag) => e.target.value !== tag);
        }

        setTags(newTags);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Criar Bingo</h1>
            <Checkbox
                value="alcoolico"
                label="Alcoólico"
                checked={tags.includes("alcoolico")}
                crossOrigin={undefined}
                onChange={toggleTag}
            />
            <Checkbox
                value="pegacao"
                label="Pegação"
                checked={tags.includes("pegacao")}
                crossOrigin={undefined}
                onChange={toggleTag}
            />

            <Button onClick={addBingo} className="mt-4">
                Criar Bingo
            </Button>
        </div>
    );
}