import axios, { AxiosResponse } from "axios";
import { Challenge } from "../domain/challenge";


export default class ChallengesController {
  static async getChallenges(): Promise<Challenge[]> {
    let challenges: Challenge[];

    try {
      const response: AxiosResponse = await axios.get(
        "/api/v1/challenge?partyId=025saologin"
      );
      challenges = response.data.challenges.map((challenge: Challenge) => ({
        numericId: challenge.numericId,
        description: challenge.description,
        tags: challenge.tags,
        points: challenge.points,
        partyId: challenge.partyId,
        id: challenge.id,
      }));
    } catch (e) {
      return [];
    }

    return challenges;
  }

  static async solveChallenge(token: string, guestId: number, score: number, guestName: string = "025corotebreak"): Promise<AxiosResponse> {
    const response: AxiosResponse = await axios.post(
      "/api/v1/challenge/score",
      {
        name: guestName,
        number: guestId,
        score,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        }
      }
    );

    return response;
  }
}
