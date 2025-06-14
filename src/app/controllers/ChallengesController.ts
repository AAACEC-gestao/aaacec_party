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
  
  static async getChallengesByTags(tags: string[]): Promise<Map<number, Challenge[]>> {
    let challenges: Map<number, Challenge[]> = new Map();

    console.log("Fetching challenges by tags:", tags);

    try {
      const all = await this.getChallenges();
      
      for (const tag of tags) {
        for (const challenge of all) {
          if (challenge.tags.includes(tag)) {
            challenges.set(challenge.points, [...(challenges.get(challenge.points) || []), challenge]);
          }
        }
      }

      for (const challenge of all) {
        if (challenge.tags.length === 0) {
          console.log("Adding challenge with no tags:", challenge);
          challenges.set(challenge.points, [...(challenges.get(challenge.points) || []), challenge]);
        } else if (tags.length > 0 && tags.every(tag => challenge.tags.includes(tag))) {
          console.log("Adding challenge with tags not in provided tags:", challenge);
          challenges.set(challenge.points, [...(challenges.get(challenge.points) || []), challenge]);
        }
      }

      console.log("Challenges by tags:", challenges);
  
      return challenges;
    } catch (e) {
      for (const diff of [1,2,3]) {
        challenges.set(diff, []);
      }
      
      return challenges;
    }
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
