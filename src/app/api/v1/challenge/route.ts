import { NextRequest } from "next/server";
import { APIError } from "../../../../lib/error/api_error";
import { Authorize } from "../../../../lib/route_method";
import { validateRequest } from "../../../../lib/validate_request";
import { AAACECRole } from "../../../domain/aaacec_roles";
import { Challenge } from "../../../domain/challenge";
import { ChallengeRepository } from "../../../repositories/challenge_repository";
import { NewChallengeDTO } from "./challenge.dto";

class ChallengeController {
  @Authorize([AAACECRole.ADMIN])
  static async POST(req: Request) {
    try {
      const body = await req.json();
      const dto = await validateRequest(
        body,
        NewChallengeDTO.schema,
        NewChallengeDTO.fromObject
      );
      const id = dto.partyId + dto.numericId;
      await ChallengeRepository.addChallenge(
        new Challenge(
          id,
          dto.description,
          dto.points,
          dto.numericId,
          dto.tags,
          dto.partyId
        )
      );
      return Response.json(
        { message: "Challenge added successfully" },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof APIError) {
        return error.failMessage();
      }

      console.error("Unexpected error in challenge POST:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }

  static async GET(req: NextRequest) {
    try {
      if (req.nextUrl.searchParams.has("partyId")) {
        const partyId = req.nextUrl.searchParams.get("partyId");
        const challenges = await ChallengeRepository.getChallenges(partyId!);
        challenges.sort((a, b) => a.numericId - b.numericId);
        return Response.json({ challenges }, { status: 200 });
      }
      throw new APIError("Please provide a partyId as a query parameter.", 400);
    } catch (error) {
      if (error instanceof APIError) {
        return error.failMessage();
      }

      console.error("Unexpected error in challenge GET:", error);
      return Response.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }
}

export async function POST(request: Request) {
  return await ChallengeController.POST(request);
}

export async function GET(request: NextRequest) {
  return await ChallengeController.GET(request);
}
