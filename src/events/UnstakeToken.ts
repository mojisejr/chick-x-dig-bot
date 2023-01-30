import { mineContract } from "../contracts/mine-contract";
import { EVENT } from "./Event";

mineContract.on(EVENT.UnstakeToken, (staker, hashPower, tokenIds) => {
  console.log("Unstaked", {
    staker,
    hashPower,
    tokenIds,
  });
});
