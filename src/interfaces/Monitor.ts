import { MiningState } from "./MiningStates";

export interface Monitor {
  totalHashPower: string;
  pendingReward: string;
  tokenCount: number;
  tokenIds: string[];
  lastWithdrawn?: number;
  state?: MiningState;
  lastUpdate: number;
  rate?: number;
}
