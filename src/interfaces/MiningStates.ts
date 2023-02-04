export interface MiningState {
  mineNo: number;
  contract: string;
  flag?: boolean;
  status: Status;
  startTime: number;
}

export enum Status {
  Mining = "Mining",
  Stop = "Stop",
}
