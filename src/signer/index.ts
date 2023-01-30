import * as dotenv from "dotenv";
import { ethers } from "ethers";
dotenv.config();
const { k } = process.env;

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.bitkubchain.io"
);
const wallet = new ethers.Wallet(k);
const signer = wallet.connect(provider);
const walletAddress = "0x4C06524B1bd7AA002747252257bBE0C472735A6D";

export { provider, signer, walletAddress };
