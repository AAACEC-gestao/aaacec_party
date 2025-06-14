export default class BingoController {

    static shuffle<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    static generateMatching(size: number, blockedCells: [number, number][] = []): [number, number][] {
        while (true) {
            const lines = BingoController.shuffle(Array.from({ length: 5 }, (_, i) => i)).slice(0, size);
            const columns = BingoController.shuffle(Array.from({ length: 5 }, (_, i) => i)).slice(0, size);

            const cells: [number, number][] = lines.map((l, idx) => [l, columns[idx]]);

            if (cells.some(([l, c]) => l === 2 && c === 2)) continue;
            if (cells.some(cell => blockedCells.some(b => b[0] === cell[0] && b[1] === cell[1]))) continue;

            return cells;
        }
    }

    static generateCrossCells(): [number, number][] {
        let x = Math.floor(Math.random() * 4);
        let y = Math.floor(Math.random() * 4);

        if (x >= 2) x++;
        if (y >= 2) y++;

        return [ [2, x], [y, 2] ];
    }

    static generateColoredBingoCard(sizeMediumMatching: number, numRemain: number[]): number[][] {
        const matrix: number[][] = Array.from({ length: 5 }, () => Array(5).fill(-1));

        const redCross = BingoController.generateCrossCells();
        const matchingMedium = BingoController.generateMatching(sizeMediumMatching, redCross);

        numRemain[2] -= 2;
        matrix[redCross[0][0]][redCross[0][1]] = 2;
        matrix[redCross[1][0]][redCross[1][1]] = 2;

        for (const [i, j] of matchingMedium) {
            matrix[i][j] = 1;
        }

        let cells: [number, number][] = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (!(i === 2 && j === 2) && !matchingMedium.some(([mi, mj]: [number, number]) => mi === i && mj === j) && !redCross.some(([ri, rj]: [number, number]) => ri === i && rj === j)) {
                    cells.push([i, j]);
                }
            }
        }

        cells = BingoController.shuffle(cells);

        let p = 0;
        for (let c = 0; c < 3; c++) {
            for (let j = 0; j < numRemain[c]; j++) {
                const [i, k] = cells[p++];
                matrix[i][k] = c;
            }
        }

        return matrix;
    }

    static generateBingoCard(
        easyChallenges: number[],
        mediumChallenges: number[],
        hardChallenges: number[]
    ): number[][] {
        const card: number[][] = Array.from({ length: 5 }, () => Array(5).fill(-1));
        const coloredCard = BingoController.generateColoredBingoCard(5, [10, 3, 6]);

        easyChallenges = BingoController.shuffle(easyChallenges);
        mediumChallenges = BingoController.shuffle(mediumChallenges);
        hardChallenges = BingoController.shuffle(hardChallenges);

        const p = [0, 0, 0];
        const challenges = [easyChallenges, mediumChallenges, hardChallenges];

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (i === 2 && j === 2) continue;

                const c = coloredCard[i][j];
                card[i][j] = challenges[c][p[c]++];
            }
        }

        return card;
    }    
}
