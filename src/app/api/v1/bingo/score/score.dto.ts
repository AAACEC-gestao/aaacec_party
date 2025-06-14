import { z } from "zod";

export class ScoreBingoDTO {
  public readonly guest: string;
  public readonly partyId: string;
  public readonly challenge: number;

  static schema = z.object({
    guest: z.string({ message: "Guest must be a string" }),
    partyId: z.string({ message: "Party ID must be a string" }),
    challenge: z.number({ message: "Challenge must be a number" }),
  });

  constructor(guest: string, partyId: string, challenge: number) {
    this.guest = guest;
    this.partyId = partyId;
    this.challenge = challenge;
  }

  static fromObject(object: any): ScoreBingoDTO {
    return new ScoreBingoDTO(object.guest, object.partyId, object.challenge);
  }
}
