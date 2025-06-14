import BingoController from "@/app/controllers/BingoController";
import { Checkbox, Button } from "@material-tailwind/react";
import { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Bingo } from "../domain/bingo";


export default function AddBingo({ guestId, setBingo }: { guestId: number, setBingo: (bingo: Bingo) => void }) {
    const [tags, setTags] = useState<string[]>(["alcoolico", "pegacao"]);

    const token = Cookies.get("token") || "";

    const getBingoCard = (tags: string[]) => {
        return [
            [1, 2, 3, 4, 5],
            [6, 7, 8, 9, 10],
            [11, 12, 13, 14, 15],
            [16, 17, 18, 19, 20],
            [21, 22, 23, 24, 25]
        ];
    }

    const addBingo = async () => {
        try {
            const bingo = await BingoController.addBingo(token, "025saologin", guestId, getBingoCard(tags));
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