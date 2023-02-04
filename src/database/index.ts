import { Monitor } from "../interfaces/Monitor";
import { MiningState, Status } from "../interfaces/MiningStates";
import * as admin from "firebase-admin";
import { getDatabase } from "firebase-admin/database";
import credentials from "../firebase.json";
import { config } from "../config";

const params = {
  type: credentials.type,
  projectId: credentials.project_id,
  privateKeyId: credentials.private_key_id,
  privateKey: credentials.private_key,
  clientEmail: credentials.client_email,
  clientId: credentials.client_id,
  authUri: credentials.auth_uri,
  tokenUri: credentials.token_uri,
  authProviderX509CertUrl: credentials.auth_provider_x509_cert_url,
  clientC509CertUrl: credentials.client_x509_cert_url,
};

const app = admin.initializeApp({
  credential: admin.credential.cert(params),
  databaseURL:
    "https://chicken-dao-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

const database = getDatabase(app);
const ref = database.ref("/");
const stateRef = database.ref("/state");

export const getRate = async () => {
  const snapshot = await ref.get();
  const data = !snapshot.exists()
    ? config.rate
    : (snapshot.val().rate as string);
  return data;
};
export const updateMonitorData = (data: Partial<Monitor>) => {
  ref.update(data);
};

export const updateLastWithdrawn = (data: Partial<Monitor>) => {
  ref.update({
    lastWithdrawn: data.lastWithdrawn,
  } as Monitor);
};

export const updateMiningState = (state: Partial<MiningState>) => {
  stateRef.update(state);
};

export const getMiningState = async () => {
  const snapshot = await stateRef.get();
  const data = !snapshot.exists()
    ? ({ mineNo: 0, status: Status.Stop } as MiningState)
    : (snapshot.val() as MiningState);
  return data;
};
