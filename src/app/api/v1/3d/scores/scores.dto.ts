import { z } from "zod";

/** DTO para aplicar deltas (POST /api/v1/3d/scores) */
export class AddScores3DDTO {
  public readonly deltas: Record<string, number>;
  public readonly occurredAt: string;

  static schema = z.object({
    deltas: z.record(
      z.string(),
      z.number({ message: "Delta must be a number" }).int({ message: "Delta must be an integer" })
    ).refine((obj) => Object.keys(obj).length > 0, {
      message: "At least one team delta is required",
    }),
    occurredAt: z.string().optional(),
  });

  constructor(deltas: Record<string, number>, occurredAt: string) {
    this.deltas = deltas;
    this.occurredAt = occurredAt;
  }

  static fromObject(object: any): AddScores3DDTO {
    return new AddScores3DDTO(object.deltas, object.occurredAt);
  }
}

/** DTO para faixa horária (GET /api/v1/3d/scores?from=HH:mm&to=HH:mm) */
const hhmm = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class ScoresBetween3DDTO {
  public readonly from: string;   // HH:mm local
  public readonly to: string;     // HH:mm local

  static schema = z.object({
    from: z.string().regex(hhmm, { message: "from must be HH:mm (24h)" }),
    to:   z.string().regex(hhmm,   { message: "to must be HH:mm (24h)" }),
  });

  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }

  static fromObject(object: any): ScoresBetween3DDTO {
    return new ScoresBetween3DDTO(object.from, object.to);
  }
}
