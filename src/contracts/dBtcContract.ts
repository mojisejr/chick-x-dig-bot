import { Erc20ABI } from "../abi/ERC20ABI";
import { config } from "../config";
import { ethers } from "ethers";
import { signer } from "../signer";

const {
  dBtcAddress,
  digAddress,
  devAddress,
  treasuryAddress,
  nextDigAddress,
  divider,
  rate,
} = config;
const dBtcContract = new ethers.Contract(dBtcAddress, Erc20ABI, signer);

export const checkdBtcBalanceOf = async (walletAddress: string) => {
  try {
    const balance = parseInt(
      (await dBtcContract.balanceOf(walletAddress)).toString()
    );
    return balance;
  } catch (error) {
    console.log("checkdBtcBalanceOf : ", error);
    return 0;
  }
};

export const splitTransfer = async (walletAddress: string) => {
  const balance = await checkdBtcBalanceOf(walletAddress);
  if (balance <= 0) throw Error("splitTransfer : cannot transfer zero balance");
  const amounts = parseInt(balance.toString()) / divider;
  console.log("amounts to sent (divided): ", amounts);
  await dBtcContract.transfer(devAddress, amounts);
  await dBtcContract.transfer(treasuryAddress, amounts);
  await dBtcContract.transfer(digAddress, amounts);
  await dBtcContract.transfer(nextDigAddress, amounts);
};
