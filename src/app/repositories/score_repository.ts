import { firestore } from "../../lib/data/firestore";
import { DataError } from "../../lib/error/data_error";

/** Offset fixo de São Paulo (UTC-3). */
const SAO_PAULO_OFFSET_MIN = -180;

/** Início da hora (truncate) para um Date. */
function startOfHour(d: Date): Date {
  const ms = d.getTime();
  const h = Math.floor(ms / 3_600_000) * 3_600_000;
  return new Date(h);
}

/**
 * Dado um instante UTC, calcula o início da hora **local (America/Sao_Paulo)**
 * e retorna esse início convertido para UTC.
 */
function hourBucketUTCFrom(instant: Date): Date {
  // Converter UTC -> horário local (UTC-3)
  const localMs = instant.getTime() + SAO_PAULO_OFFSET_MIN * 60_000;
  const localStartHour = startOfHour(new Date(localMs));
  // Voltar para UTC (local + 3h)
  const utcMs = localStartHour.getTime() - SAO_PAULO_OFFSET_MIN * 60_000;
  return new Date(utcMs);
}

/**
 * Estrutura de coleções:
 * - scores_events: eventos atômicos (partyId, teamId, delta, occurredAt)
 * - scores_hourly: agregados por hora (partyId__teamId__hourStartISO) → { partyId, teamId, hourStart, points }
 * - scores_totals: totais por time (partyId__teamId) → { partyId, teamId, totalScore }
 *
 * Observação: teamId é STRING.
 */
export class ScoreRepository {
  /**
   * Aplica deltas para uma festa (partyId) e agrega no bucket horário local (America/Sao_Paulo).
   * - Cria documentos em `scores_events`
   * - Upsert/increment em `scores_hourly`
   * - Atualiza `scores_totals`
   */
  static async applyDeltas(
    partyId: string,
    deltas: Record<string, number>,
    occurredAt?: string
  ): Promise<void> {
    if (!partyId) throw new DataError("partyId is required", "scores");
    if (!deltas || Object.keys(deltas).length === 0) {
      throw new DataError("At least one team delta is required", "scores");
    }

    const now = occurredAt ? new Date(occurredAt) : new Date();
    const hourBucketUTC = hourBucketUTCFrom(now); // início da hora local → UTC

    await firestore.runTransaction(async (tx) => {
      for (const [teamId, deltaRaw] of Object.entries(deltas)) {
        if (typeof teamId !== "string") continue;
        const delta = Number(deltaRaw);
        if (!Number.isFinite(delta) || !Number.isInteger(delta)) continue;

        // 1) Log do evento
        const evRef = firestore.collection("scores_events").doc();
        tx.set(evRef, {
          partyId,
          teamId,          // string
          delta,           // number
          occurredAt: now, // Date (UTC)
        });

        // 2) Aggregado por hora (upsert + increment)
        const hourKey = `${partyId}__${teamId}__${hourBucketUTC.toISOString()}`;
        const hourlyRef = firestore.doc(`scores_hourly/${hourKey}`);
        const hourlySnap = await tx.get(hourlyRef);
        if (hourlySnap.exists) {
          const cur = Number(hourlySnap.data()?.points ?? 0);
          tx.update(hourlyRef, { points: cur + delta });
        } else {
          tx.set(hourlyRef, {
            partyId,
            teamId,
            hourStart: hourBucketUTC,
            points: delta,
          });
        }

        // 3) Total por time
        const totalKey = `${partyId}__${teamId}`;
        const totalRef = firestore.doc(`scores_totals/${totalKey}`);
        const totalSnap = await tx.get(totalRef);
        if (totalSnap.exists) {
          const cur = Number(totalSnap.data()?.totalScore ?? 0);
          tx.update(totalRef, { totalScore: cur + delta });
        } else {
          tx.set(totalRef, { partyId, teamId, totalScore: delta });
        }
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
    fromUTC: Date,
    toUTC: Date,
    teamId?: string
  ): Promise<Array<{ teamId: string; points: number }>> {
    if (!partyId) throw new DataError("partyId is required", "scores");
    if (!(fromUTC instanceof Date) || isNaN(fromUTC.getTime())) {
      throw new DataError("fromUTC must be a valid Date", "scores");
    }
    if (!(toUTC instanceof Date) || isNaN(toUTC.getTime())) {
      throw new DataError("toUTC must be a valid Date", "scores");
    }

    let query: any = firestore
      .collection("scores_events")
      .where("partyId", "==", partyId)
      .where("occurredAt", ">=", fromUTC)
      .where("occurredAt", "<", toUTC);

    if (teamId) {
      query = query.where("teamId", "==", teamId);
    }

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
