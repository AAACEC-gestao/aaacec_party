import { APIError } from "@/lib/error/api_error";
import { DataError } from "@/lib/error/data_error";
import { Authorize } from "@/lib/route_method";
import { validateRequest } from "@/lib/validate_request";
import { AAACECRole } from "../../../domain/aaacec_roles";
import { BingoRepository } from "../../../repositories/bingo_repository";
import { AddBingoDTO } from "./bingo.dto";
import { Bingo } from "@/app/domain/bingo";

class BingoController {
  @Authorize([AAACECRole.ADMIN, AAACECRole.WORKER])
  static async POST(req: Request) {
    try {
      const body = await req.json();
      const dto = await validateRequest(
        body,
        AddBingoDTO.schema,
        AddBingoDTO.fromObject
      );

      await BingoRepository.addBingo(
        dto.guest,
        dto.card,
        dto.partyId,
        dto.completedChallenges
      );

      return Response.json(
        {
          message: "Bingo added successfully",
          bingo: new Bingo(
          "",
          dto.guest,
          dto.card,
          dto.partyId,
          dto.completedChallenges
          )
        },
        { status: 201 }
      );
    } catch (error) {
      if (error instanceof DataError) {
        return Response.json(
          { message: error.message },
          { status: 400 }
        );
      } else if (error instanceof APIError) {
        return Response.json(
          { message: error.message },
          { status: 500 }
        );
      } else {
        console.error("Unexpected error:", error);
        return Response.json(
          { message: "Internal server error" },
          { status: 500 }
        );
      }
    }
  }

  static async GET(req: Request) {
    try {
      const url = new URL(req.url);
      const guest = url.searchParams.get("guest");
      const partyId = url.searchParams.get("partyId");

      if (!guest || !partyId) {
        return Response.json(
          { message: "Guest and Party ID are required" },
          { status: 400 }
        );
      }

      const bingo = await BingoRepository.getBingoByGuest(guest, partyId);
      return Response.json(bingo, { status: 200 });
    } catch (error) {
      if (error instanceof DataError) {
        return Response.json(
          { message: error.message },
          { status: 400 }
        );
      } else if (error instanceof APIError) {
        return Response.json(
          { message: error.message },
          { status: 500 }
        );
      } else {
        console.error("Unexpected error:", error);
        return Response.json(
          { message: "Internal server error" },
          { status: 500 }
        );
      }
    }
  }
}

export function POST(req: Request) {
  return BingoController.POST(req);
}
