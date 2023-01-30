import "./events";
import * as cron from "cron";
import { ethers } from "ethers";
import { getBalanceOf, getTokens } from "./contracts/dig-contract";
import {
  stake,
  getMineInfoOf,
  getPendingReward,
  withdraw,
} from "./contracts/mine-contract";
import { walletAddress } from "./signer";
import { config } from "./config";

//CRONJOB THAT CHECK AND WITHDRAW
const job = new cron.CronJob("*/1 * * * *", async () => {
  const balance = await getBalanceOf(walletAddress);
  if (balance <= 0) {
    console.log("found zero balance check in mine.");
    const { stakedTokenIds } = await getMineInfoOf(walletAddress);
    if (stakedTokenIds <= 0) {
      console.log("nothing in mine also stop cron");
      job.stop();
    }
    console.log("token in mine: ", stakedTokenIds);
  } else if (balance > 0) {
    console.log("found in wallet : ", balance);
    console.log("staking all..");
    const tokenIds = await getTokens(walletAddress, balance);
    await stake(tokenIds);
  }

  console.log("done staking phase...");

  console.log("checking reward ...");
  const reward = await getPendingReward(walletAddress);
  const strReward = ethers.utils.formatEther(reward[1].toString());
  console.log(`pending reward :  ${strReward} dBTC`);
  console.log("withdraw rate : ", config.rate);

  if (parseInt(strReward) >= config.rate) {
    console.log("withdraw reward ...");
    await withdraw();
  } else {
    console.log("not exceed withdrawal rate continue ...");
  }
});

console.log("Started !~");
job.start();
