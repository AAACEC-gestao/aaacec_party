import { z } from "zod";

/** DTO para aplicar deltas (POST /api/v1/3d/scores) */
export class AddScores3DDTO {
  public readonly deltas: Record<string, number>;
  public readonly occurredAt?: string; // ISO opcional

  static schema = z.object({
    deltas: z.record(
      z.string(),
      z.number({ message: "Delta must be a number" }).int({ message: "Delta must be an integer" })
    ).refine((obj) => Object.keys(obj).length > 0, {
      message: "At least one team delta is required",
    }),
    occurredAt: z.string().datetime().optional(),
  });

  constructor(deltas: Record<string, number>, occurredAt?: string) {
    this.deltas = deltas;
    this.occurredAt = occurredAt;
  }

  static fromObject(object: any): AddScores3DDTO {
    return new AddScores3DDTO(object.deltas, object.occurredAt);
  }
}

/** DTO para faixa horária (GET /api/v1/3d/scores?from=HH:mm&to=HH:mm[&teamId=...][&tz=...]) */
const hhmm = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class ScoresBetween3DDTO {
  public readonly from: string;   // HH:mm local
  public readonly to: string;     // HH:mm local
  public readonly teamId?: string;
  public readonly tz?: string;    // ex: America/Sao_Paulo

  static schema = z.object({
    from: z.string().regex(hhmm, { message: "from must be HH:mm (24h)" }),
    to:   z.string().regex(hhmm,   { message: "to must be HH:mm (24h)" }),
    teamId: z.string().optional(),
    tz: z.string().optional(),
  }).refine(obj => {
    const [fh, fm] = obj.from.split(":").map(Number);
    const [th, tm] = obj.to.split(":").map(Number);
    return (th*60+tm) > (fh*60+fm);
  }, { message: "'to' must be greater than 'from' within the same day" });

  constructor(from: string, to: string, teamId?: string, tz?: string) {
    this.from = from;
    this.to = to;
    this.teamId = teamId;
    this.tz = tz;
  }

  static fromObject(object: any): ScoresBetween3DDTO {
    return new ScoresBetween3DDTO(object.from, object.to, object.teamId, object.tz);
  }
}
