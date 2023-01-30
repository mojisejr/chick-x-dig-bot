import { mineContract } from "../contracts/mine-contract";
import { EVENT } from "./Event";

mineContract.on(EVENT.RewardWithdrawn, (address) => {
  console.log("reward withdrawn from : ", address);
});
