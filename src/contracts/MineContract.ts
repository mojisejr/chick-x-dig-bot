import { ethers } from "ethers";
import { mineABI, mineAddress } from "../abi/MineABI";
import { signer } from "../signer";
import { MineInfo } from "../interfaces/MineInfo";
import { EVENT } from "../events/Event";

export class MineContract {
  private contract!: ethers.Contract;
  private signer: ethers.Wallet;
  private abi: any;
  private mineAddress: string;
  public index: number;

  constructor(_mineAddress: string, _index: number) {
    this.signer = signer;
    this.abi = mineABI;
    this.index = _index;
    this.mineAddress = _mineAddress;
    this.contract = new ethers.Contract(
      this.mineAddress,
      this.abi,
      this.signer
    );
  }

  getContract = () => {
    return this.contract;
  };

  rewardWithdrawnEvent = () => {
    this.contract.on(EVENT.RewardWithdrawn, (address) => {
      console.log("reward withdrawn from : ", address);
    });
  };

  getMineInfoOf = async (walletAddress: string) => {
    try {
      let info = [];
      info = await this.contract.getUserInfo(walletAddress);
      return {
        stakedTokenIds: info.stakedTokenIds.map((s: any) => s.toString()),
        stakedHashPowerAmount: info.stakedHashPowerAmount.toString(),
      } as MineInfo;
    } catch (error) {
      console.log("getMineInfoOf : ", error);
      return {
        stakedTokenIds: [],
        stakedHashPowerAmount: "0",
      } as MineInfo;
    }
  };

  stake = async (tokens: string[] = []) => {
    if (tokens.length <= 0) throw Error("cannot stake 0 tokens");
    try {
      await this.contract.stake(tokens);
    } catch (error) {
      console.log("stake : ", error);
    }
  };

  unstake = async (tokens: string[] = []) => {
    if (tokens.length <= 0) throw Error("cannot stake 0 tokens");
    try {
      await this.contract.unstake(tokens);
    } catch (error) {
      console.log("unstake : ", error);
    }
  };

  getPendingReward = async (walletAddress: string) => {
    try {
      const reward = await this.contract.pendingReward(walletAddress);
      return reward;
    } catch (error) {
      console.log("getPendingReward : ", error);
      return [0, 0];
    }
  };

  withdraw = async () => {
    try {
      await this.contract.withdrawReward();
    } catch (error) {
      console.log("withdraw : ", error);
    }
  };
}
