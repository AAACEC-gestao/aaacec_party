import { APIError } from "@/lib/error/api_error";
import { DataError } from "@/lib/error/data_error";
import { Authorize } from "@/lib/route_method";
import { validateRequest } from "@/lib/validate_request";
import { AAACECRole } from "../../../../domain/aaacec_roles";
import { DDDRepository } from "../../../../repositories/ddd_repository";
import { AddScores3DDTO, ScoresBetween3DDTO } from "./scores.dto";

const PARTY_ID = "3d";

class Scores3DController {
  /** Aplica deltas no evento "3d". */
  @Authorize([AAACECRole.ADMIN, AAACECRole.WORKER])
  static async POST(req: Request) {
    try {
      const body = await req.json();
      const dto = await validateRequest(body, AddScores3DDTO.schema, AddScores3DDTO.fromObject);

      await DDDRepository.applyDeltas(PARTY_ID, dto.deltas, dto.occurredAt);

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
      };

      const dto = await validateRequest(raw, ScoresBetween3DDTO.schema, ScoresBetween3DDTO.fromObject);

      const rows = await DDDRepository.getScoresBetween(PARTY_ID, dto.from, dto.to);

      return Response.json(
        {
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
