import { z } from "zod";

export class AddBingoDTO {
  public readonly guest: string;
  public readonly card: Array<Array<number>>;
  public completedChallenges: Array<number>;
  public readonly partyId: string;

  static schema = z.object({
    guest: z.string({ message: "Guest must be a string" }),
    partyId: z.string({ message: "Party ID must be a string" }),
    card: z.array(z.array(z.number()), { message: "Card must be a 2D array of numbers" })
      .min(5, { message: "Card must have at least 5 rows" })
      .max(5, { message: "Card must have at most 5 rows" })
      .refine(rows => rows.every(row => row.length === 5), {
        message: "Each row in the card must have exactly 5 numbers"
      }),
  });

  constructor(guest: string, card: Array<Array<number>>, partyId: string) {
    this.guest = guest;
    this.card = card;
    this.partyId = partyId;
    this.completedChallenges = [];
  }

  static fromObject(object: any): AddBingoDTO {
    return new AddBingoDTO(object.guest, object.card, object.partyId);
  }
}
