import { firestore } from "../../lib/data/firestore";
import { JWTSigner } from "../../lib/jwt/jwt_signer";
import crypto from "crypto";

export class AuthRepository {
  static async login(username: string, password: string) {
    const user = await firestore.doc(`users/${username}`).get();
    const salt = process.env.AUTH_SALT ?? "salt";
    const hash = crypto
      .pbkdf2Sync(password, salt, 100, 64, "sha512")
      .toString("hex");

    if (user.exists) {
      const data = user.data()!;
      if (data.password === hash) {
        return JWTSigner.sign({ username: data.username, role: data.role });
      }
      throw new Error("Password is incorrect");
    }
    throw new Error("Username does not exists");
  }

  static async register(username: string, password: string) {
    const user = await firestore.doc(`users/${username}`).get();
    if (user.exists) {
      throw new Error("Username already exists");
    }
    const salt = process.env.AUTH_SALT ?? "salt";
    const hash = crypto
      .pbkdf2Sync(password, salt, 100, 64, "sha512")
      .toString("hex");

    await firestore
      .doc(`users/${username}`)
      .set({ username, password: hash, role: "worker" });
    return JWTSigner.sign({ username, role: "worker" });
  }
}
