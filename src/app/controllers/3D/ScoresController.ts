import axios, { AxiosResponse } from "axios";

export interface RangeScore {
  teamId: string; // ids de times são strings
  points: number;
}

export default class ScoresController {
  /** Aplica deltas; retorna true/false informando se a operação foi bem-sucedida. */
  static async applyDeltas(
    token: string,
    deltas: Record<string, number>,
    occurredAt?: string
  ): Promise<boolean> {
    try {
      const res: AxiosResponse = await axios.post(
        "/api/v1/3d/scores",
        { deltas, occurredAt },
        { headers: { Authorization: "Bearer " + token } }
      );
      return res.status >= 200 && res.status < 300;
    } catch {
      return false;
    }
  }

  /** Soma dos pontos por time na faixa [from, to) no dia local corrente (sem 'date'). */
  static async getScoresBetween(
    token: string,
    from: string, // "HH:mm" (local)
    to: string,   // "HH:mm" (local)
    teamId?: string,
    tz: string = "America/Sao_Paulo"
  ): Promise<RangeScore[]> {
    try {
      const qs = new URLSearchParams({
        from,
        to,
        tz,
        ...(teamId ? { teamId } : {}),
      });

      const response: AxiosResponse = await axios.get(
        `/api/v1/3d/scores?${qs.toString()}`,
        { headers: { Authorization: "Bearer " + token } }
      );

      const items = Array.isArray(response.data?.scores) ? response.data.scores : [];
      return items.map((s: any) => ({
        teamId: String(s.teamId),
        points: Number(s.points ?? 0),
      }));
    } catch {
      return [];
    }
  }
}
