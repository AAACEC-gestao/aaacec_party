type Scores = Record<string, number>;
type Team = { teamId: string; name: string; color: string, bgcolor: string };

const TEAMS: Team[] = [
  { teamId: "blue", name: "Azul", color: "#3b82f6", bgcolor: '#03132eff' },
  { teamId: "red", name: "Vermelho", color: "#ef4444", bgcolor: '#240202ff' },
  { teamId: "pink", name: "Rosa", color: "#fb15dd", bgcolor: '#290032ff' },
  { teamId: "green", name: "Verde", color: "#22c55e", bgcolor: '#012704ff' },
  { teamId: "purple", name: "Roxo", color: "#a855f7", bgcolor: '#1E0137' },
];

const PRIZES: Record<string, string> = {
  "17:00": "Tequiloka",
  "18:00": "Fini",
  "19:00": "Cachaça Sabores",
  "20:00": "Licor Sabores",
  "21:00": "Mini Salgados",
};

const getHour = (delta: number) => {
  const now = new Date();
  const currentHour = now.getHours();
  return `${(currentHour + delta).toString().padStart(2, '0')}:00`;
}

const getWinner = (scores: Scores): string => {
  return Object.keys(scores).reduce((a, b) => {
    if (!a) return b;
    if (scores[a] > scores[b]) return a;
    if (scores[a] < scores[b]) return b;

    return a < b ? a : b;
  }, "");
}

const getScores = async (fromHour: string, toHour: string): Promise<Scores> => {
  const response = await fetch(`/api/v1/3d/scores?from=${fromHour}&to=${toHour}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar pontuações");
  }

  const data = await response.json();
  const scores = {} as Scores;
  for (const score of data.scores) {
    scores[score.teamId] = score.points;
  }
  
  return scores;
};


export { TEAMS, PRIZES, getWinner, getScores, getHour };
export type { Team, Scores };