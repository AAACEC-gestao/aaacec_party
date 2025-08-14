import { APIError } from "@/lib/error/api_error";
import { DataError } from "@/lib/error/data_error";
import { Authorize } from "@/lib/route_method";
import { validateRequest } from "@/lib/validate_request";
import { AAACECRole } from "../../../../domain/aaacec_roles";
import { ScoreRepository } from "../../../../repositories/score_repository";
import { AddScores3DDTO, ScoresBetween3DDTO } from "./scores.dto";
import { DEFAULT_ZONE, toUTCFromLocal } from "@/lib/time";
import { DateTime } from "luxon";

const PARTY_ID = "3d";

class Scores3DController {
  /** Aplica deltas no evento "3d". */
  @Authorize([AAACECRole.ADMIN, AAACECRole.WORKER])
  static async POST(req: Request) {
    try {
      const body = await req.json();
      const dto = await validateRequest(body, AddScores3DDTO.schema, AddScores3DDTO.fromObject);

      await ScoreRepository.applyDeltas(PARTY_ID, dto.deltas, dto.occurredAt);

      // O front só checa 2xx → boolean; respondemos simples.
      return Response.json({ ok: true }, { status: 201 });
    } catch (error: any) {
      if (error instanceof DataError) {
        return Response.json({ message: error.message }, { status: 400 });
      } else if (error instanceof APIError) {
        return Response.json({ message: error.message }, { status: 500 });
      } else {
        console.error("Unexpected error:", error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
      }
    }
  }

  /** Soma dos pontos por time entre [from, to) no dia local corrente (sem 'date'). */
  static async GET(req: Request) {
    try {
      const url = new URL(req.url);
      const raw = {
        from: url.searchParams.get("from"),
        to: url.searchParams.get("to"),
        teamId: url.searchParams.get("teamId") ?? undefined,
        tz: url.searchParams.get("tz") ?? undefined,
      };

      const dto = await validateRequest(raw, ScoresBetween3DDTO.schema, ScoresBetween3DDTO.fromObject);

      const zone = dto.tz ?? DEFAULT_ZONE ?? "America/Sao_Paulo";

      // Usa o dia "hoje" no fuso local:
      const todayLocal = DateTime.now().setZone(zone).toISODate()!; // YYYY-MM-DD
      const fromUTC = toUTCFromLocal(todayLocal, dto.from, zone);
      const toUTC   = toUTCFromLocal(todayLocal, dto.to,   zone);

      const rows = await ScoreRepository.getScoresBetween(PARTY_ID, fromUTC, toUTC, dto.teamId);

      return Response.json(
        {
          partyId: PARTY_ID,
          range: { from: dto.from, to: dto.to, tz: zone },
          fromUTC,
          toUTC,
          scores: rows.map(r => ({ teamId: String(r.teamId), points: Number(r.points ?? 0) })),
        },
        { status: 200 }
      );
    } catch (error: any) {
      if (error instanceof DataError) {
        return Response.json({ message: error.message }, { status: 400 });
      } else if (error instanceof APIError) {
        return Response.json({ message: error.message }, { status: 500 });
      } else {
        console.error("Unexpected error:", error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
      }
    }
  }
}

export async function POST(req: Request) {
  return await Scores3DController.POST(req);
}

export async function GET(req: Request) {
  return await Scores3DController.GET(req);
}
