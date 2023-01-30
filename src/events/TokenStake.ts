import * as cron from "cron";
import { walletAddress } from "../signer";
import { mineContract } from "../contracts/mine-contract";
import { unstake, getMineInfoOf } from "../contracts/mine-contract";
import { EVENT } from "./Event";

mineContract.on(EVENT.StakeTokens, (staker, hashPower, tokenIds) => {
  console.log("Staked", {
    staker,
    hashPower,
    tokenIds,
  });
});
