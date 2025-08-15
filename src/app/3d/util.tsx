type Scores = Record<string, number>;
type Team = { id: string; name: string; color: string, bgcolor: string };

const TEAMS: Team[] = [
  { id: "blue", name: "Azul", color: "#3b82f6", bgcolor: '#03132eff' },
  { id: "red", name: "Vermelho", color: "#ef4444", bgcolor: '#240202ff' },
  { id: "pink", name: "Rosa", color: "#fb15dd", bgcolor: '#290032ff' },
  { id: "green", name: "Verde", color: "#22c55e", bgcolor: '#012704ff' },
  { id: "purple", name: "Roxo", color: "#a855f7", bgcolor: '#1E0137' },
];

const PRIZES: Record<string, string> = {
  "17:00": "Tequiloka",
  "18:00": "Fini",
  "19:00": "Cachaça Sabores",
  "20:00": "Licor Sabores",
  "21:00": "Mini Salgados",
};

const getWinner = (scores: Scores): string => {
  return Object.keys(scores).reduce((a, b) => {
    if (scores[a] > scores[b]) return a;
    if (scores[a] < scores[b]) return b;

    return a < b ? a : b;
  });
}

export { TEAMS, PRIZES, getWinner };
export type { Team, Scores };