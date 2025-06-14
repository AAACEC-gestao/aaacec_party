import axios, { AxiosResponse } from "axios";
import { Bingo } from "../domain/bingo";
import { APIError } from "@/lib/error/api_error";

export default class BingoController {
  static async addBingo(
    token: string,
    guestName: string = "025saologin",
    guestId: number,
    card: Array<Array<number>>
  ): Promise<Bingo> {
    let bingo: Bingo;
    
    try {
      const response: AxiosResponse = await axios.post("/api/v1/bingo", {
        guest: `${guestName}-${guestId}`,
        card,
        partyId: "025saologin",
      }, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      bingo = response.data.bingo as Bingo;
    } catch (e) {
      throw new APIError("Failed to add bingo", 400);
    }
    
    return bingo;
  }

  static async getBingo(
    guestId: number,
    guestName: string = "025saologin"
  ): Promise<Bingo> {
    let bingo: Bingo;

    try {
      console.log("Fetching bingo for guest:", guestName, guestId);
      const response: AxiosResponse = await axios.get(
        `/api/v1/bingo?partyId=025saologin&guest=${guestName}-${guestId}`
      );
      bingo = response.data as Bingo;
    } catch (e) {
      if (axios.isAxiosError(e) && e.response && e.response.status === 404) {
        throw new APIError("Bingo not found for the specified guest and party.", 404);
      }

      throw new APIError("Failed to fetch bingo data", 400);
    }

    return bingo;
  }

  static async solveChallenge(
    token: string,
    guest: string,
    challenge: number,
    guestName: string = "025saologin"
  ): Promise<AxiosResponse> {
    const response: AxiosResponse = await axios.post(
      "/api/v1/bingo/score",
      {
        guest,
        partyId: "025saologin",
        challenge,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    return response;
  }
}
