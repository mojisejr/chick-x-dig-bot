export interface MiningState {
  mineNo: number;
  contract: string;
  flag?: boolean;
  status: Status;
}

export enum Status {
  Mining = "Mining",
  Stop = "Stop",
}
