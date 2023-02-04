import { EVENT } from "./Event";
import { config } from "../config";
import { ethers } from "ethers";
import { mineABI } from "../abi/MineABI";
import { signer, walletAddress } from "../signer";
import { updateMiningState } from "../database";
import { Status } from "../interfaces/MiningStates";
import { splitTransfer } from "../contracts/dBtcContract";

config.mines.forEach((mine, index) => {
  const contract = new ethers.Contract(mine, mineABI, signer);
  contract.on(EVENT.StakeTokens, (staker, hashPower, tokenIds) => {
    if (staker != walletAddress) return;
    updateState(mine, Status.Mining);
    console.log(`${tokenIds} in-> mine ${index}`);
  });
  contract.on(EVENT.UnstakeToken, (staker, hashPower, tokenIds) => {
    if (staker != walletAddress) return;
    updateState(mine, Status.Stop);
    console.log(`${tokenIds} <-out mine ${index}`);
  });
  contract.on(EVENT.RewardWithdrawn, async (address) => {
    if (address != walletAddress) return;
    console.log("reward withdrawal .. ");
    try {
      await splitTransfer(walletAddress);
    } catch (error) {
      console.log(error);
    }
  });
});

const updateState = (mineAddress: string, status: Status) => {
  const index = config.mines.indexOf(mineAddress);
  updateMiningState({
    mineNo: index,
    contract: mineAddress,
    status,
  });
};
