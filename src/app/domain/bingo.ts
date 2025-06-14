export class Bingo {
  constructor(
    public readonly guest: string,
    public readonly card: Array<Array<number>>,
    public readonly partyId: string,
    public completedChallenges: Array<number>
  ) {}
}