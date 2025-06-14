import moment from "moment";
import { firestore } from "../../lib/data/firestore";
import { Bingo } from "../domain/bingo";
import { ChallengeHistory } from "../domain/challenge_history";

export class BingoRepository {
  static async addBingo(guest: string, card: Array<Array<number>>, partyId: string, completedChallenges: Array<number>) {
    await firestore.collection("bingo").add({
      guest,
      card,
      partyId,
      completedChallenges,
      createdAt: moment().toISOString(),
    });
  }

  static async getBingoByGuest(guest: string, partyId: string) {
    const bingo = await firestore
      .collection("bingo")
      .where("guest", "==", guest)
      .where("partyId", "==", partyId)
      .get();

    if (bingo.empty) {
      throw new Error("Bingo not found for the specified guest and party.");
    }

    return bingo.docs.map((doc) => {
      const data = doc.data();
      return new Bingo(
        doc.id,
        data.guest,
        data.card,
        data.partyId,
        data.completedChallenges
      );
    });
  }

  static async completeChallenge(guest: string, partyId: string, challenge: number): Promise<Array<Array<number>>> {


    const bingo = await firestore.collection("bingo").where("guest", "==", guest).where("partyId", "==", partyId).get();
    
    if (bingo.empty) {
      throw new Error("Bingo not found for the specified guest and party.");
    }

    const bingoDoc = bingo.docs[0];
    const data = bingoDoc.data();

    if (!data.completedChallenges.includes(challenge)) {
      data.completedChallenges.push(challenge);
      await firestore.doc(`bingo/${bingoDoc.id}`).set(data);
    }

    return data.card;
  }

  static async getBingoById(id: string): Promise<Bingo> {
    const bingoDoc = await firestore.doc(`bingo/${id}`).get();

    if (!bingoDoc.exists) {
      throw new Error("Bingo not found");
    }

    const data = bingoDoc.data();

    if (!data) {
      throw new Error("Bingo data is empty");
    }

    return new Bingo(
      bingoDoc.id,
      data.guest,
      data.card,
      data.partyId,
      data.completedChallenges
    );
  }


  static async addChallengeHistory(challenge_history: ChallengeHistory) {
    await firestore.doc(`challenges_history/${challenge_history.user}-${challenge_history.guest}-${challenge_history.ts}`).set({
      guest: challenge_history.guest,
      user: challenge_history.user,
      timestamp: challenge_history.ts,
    });
  }
}
