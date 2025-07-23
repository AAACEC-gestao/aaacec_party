import { Firestore } from "@google-cloud/firestore";

var firestoreCredentials;
if (process.env.FIRESTORE_CREDENTIALS) {
  firestoreCredentials = JSON.parse(process.env.FIRESTORE_CREDENTIALS);
} else if (process.env.AAACEC_PARTY_ENVIRONMENT == "production") {
  throw new Error("Firestore credentials not found, but environment is production.");
}

const firestore = new Firestore({
  projectId: "aaacec-party",
  credentials: {
    client_email: firestoreCredentials?.client_email ?? "",
    private_key: firestoreCredentials?.private_key ?? "",
  },
});

if (process.env.AAACEC_PARTY_ENVIRONMENT !== "production") {
  firestore.settings({
    host: "localhost:8080",
    ssl: false,
  });
}

export { firestore };
