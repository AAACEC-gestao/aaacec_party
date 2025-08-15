import { firestore } from "../../lib/data/firestore";
import { DataError } from "../../lib/error/data_error";

/**
 * Estrutura de coleções:
 * - scores_events: eventos atômicos (partyId, teamId, delta, occurredAt)
 * - scores_hourly: agregados por hora (partyId__teamId__hourStartISO) → { partyId, teamId, hourStart, points }
 * - scores_totals: totais por time (partyId__teamId) → { partyId, teamId, totalScore }
 *
 * Observação: teamId é STRING.
 */
export class DDDRepository {
  /**
   * Aplica deltas para uma festa (partyId) e agrega no bucket horário local (America/Sao_Paulo).
   * - Cria documentos em `scores_events`
   * - Upsert/increment em `scores_hourly`
   * - Atualiza `scores_totals`
   */
  static async applyDeltas(
    partyId: string,
    deltas: Record<string, number>,
    occurredAt: string
  ): Promise<void> {
    if (!partyId) throw new DataError("partyId is required", "scores");
    if (!deltas) {
      throw new DataError("At least one team delta is required", "scores");
    }

    const now = new Date(occurredAt)

    await firestore.runTransaction(async (tx) => {
      for (const [teamId, deltaRaw] of Object.entries(deltas)) {
        if (typeof teamId !== "string") continue;
        const delta = Number(deltaRaw);
        if (!Number.isFinite(delta) || !Number.isInteger(delta)) continue;

        // 1) Log do evento
        const evRef = firestore.collection("scores_events").doc();
        tx.set(evRef, {
          partyId,
          teamId,     // string
          delta,      // number
          occurredAt, // string
        });
      }
    });
  }

  /**
   * Soma dos deltas por time no intervalo [fromUTC, toUTC).
   * - Se `teamId` for informado, filtra por esse time.
   * - Retorna lista de { teamId: string, points: number }.
   */
  static async getScoresBetween(
    partyId: string,
    fromUTC: string,
    toUTC: string,
  ): Promise<Array<{ teamId: string; points: number }>> {
    if (!partyId) throw new DataError("partyId is required", "scores");

    let query: any = firestore
      .collection("scores_events")
      .where("partyId", "==", partyId)
      .where("occurredAt", ">=", fromUTC)
      .where("occurredAt", "<", toUTC);

    const snap = await query.get();
    if (snap.empty) return [];

    const acc = new Map<string, number>();
    snap.docs.forEach((doc: any) => {
      const d = doc.data();
      const id = String(d.teamId);
      const delta = Number(d.delta ?? 0);
      acc.set(id, (acc.get(id) ?? 0) + delta);
    });

    return Array.from(acc.entries())
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([id, points]) => ({ teamId: id, points }));
  }
}
