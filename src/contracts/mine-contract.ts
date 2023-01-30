import { ethers } from "ethers";
import { mineABI, mineAddress } from "../abi/mine-abi";
import { signer, walletAddress } from "../signer";

const mineContract = new ethers.Contract(mineAddress, mineABI, signer);

const getMineInfoOf = async (walletAddress: string) => {
  let info = [];
  info = await mineContract.getUserInfo(walletAddress);
  return {
    stakedTokenIds: info.stakedTokenIds.map((s: any) => s.toString()),
    stakedHashPowerAmount: info.stakedHashPowerAmount.toString(),
  };
};

const stake = async (tokens: string[] = []) => {
  if (tokens.length <= 0) throw Error("cannot stake 0 tokens");
  try {
    await mineContract.stake(tokens);
  } catch (error) {
    console.log(error);
  }
};

const unstake = async (tokens: string[] = []) => {
  if (tokens.length <= 0) throw Error("cannot stake 0 tokens");
  try {
    await mineContract.unstake(tokens);
  } catch (error) {
    console.log(error);
  }
};

const getPendingReward = async (walletAddress: string) => {
  const reward = await mineContract.pendingReward(walletAddress);
  console.log(reward);
  return reward;
};

const withdraw = async () => {
  await mineContract.withdrawReward();
};

export {
  mineContract,
  getMineInfoOf,
  stake,
  unstake,
  getPendingReward,
  withdraw,
};
