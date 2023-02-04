import "./events";
import * as cron from "cron";
import { ethers } from "ethers";
import { getBalanceOf, getTokens } from "./contracts/DigContract";
import { walletAddress } from "./signer";
import { config } from "./config";
import { getMiningState, getRate, updateMonitorData } from "./database";
import { MineContract } from "./contracts/MineContract";
import { Status } from "./interfaces/MiningStates";

//CRONJOB THAT CHECK AND WITHDRAW
const job = new cron.CronJob("* * * * *", async () => {
  const state = await getMiningState();
  const rate = await getRate();
  const balance = await getBalanceOf(walletAddress);
  const mines = config.mines;
  let tokenIds: string[] = [];
  let totalHashPower = "";
  let currentMine = new MineContract(mines[state.mineNo], state.mineNo);
  let now = new Date().getTime();

  if (!state.flag && state.startTime < now) {
    console.log(
      "flag set to false or mine is closed stop all process and wait .."
    );
    return;
  }

  if (balance! <= 0 && state.flag && state.status == Status.Mining) {
    console.log("mining ... in : ", state.mineNo);
    const { stakedTokenIds, stakedHashPowerAmount } =
      await currentMine.getMineInfoOf(walletAddress);

    tokenIds = stakedTokenIds;
    totalHashPower = stakedHashPowerAmount;

    if (stakedTokenIds.length <= 0) {
      console.log("nothing in mine also stop cron");
      job.stop();
    }
    console.log("token in mine: ", stakedTokenIds);
  } else if (balance! > 0 && state.flag && state.status != Status.Mining) {
    console.log("activated staking to mine no.", state.mineNo);
    const tokens = await getTokens(walletAddress, balance);
    await currentMine.stake(tokens);
    return;
  } else if (balance! <= 0 && state.flag && state.status == Status.Stop) {
    console.log("deactivated mine unstaking ..");
    const { stakedTokenIds } = await currentMine.getMineInfoOf(walletAddress);
    await currentMine.unstake(stakedTokenIds);
    return;
  }

  console.log("checking reward ...");
  const reward = await currentMine.getPendingReward(walletAddress);
  const strReward: string = ethers.utils.formatEther(reward[1].toString());
  console.log(`pending reward :  ${strReward} dBTC`);
  console.log(`withdraw rate : ${rate} dBtc`);

  console.log("update monitoring ...");
  updateMonitorData({
    totalHashPower,
    pendingReward: strReward,
    tokenIds,
    tokenCount: tokenIds.length,
    lastUpdate: new Date().getTime(),
    rate: rate,
  });

  console.log({
    reward: parseFloat(strReward),
    rate: parseFloat(rate),
    compare: parseFloat(strReward) > parseFloat(rate),
  });

  if (parseFloat(strReward) >= parseFloat(rate)) {
    console.log("withdraw reward ...");
    await currentMine.withdraw();
  } else {
    console.log("not exceed withdrawal rate continue ...");
  }
});

console.log("Started !~");
job.start();
