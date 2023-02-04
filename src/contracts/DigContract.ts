import { ethers } from "ethers";
import { digABI, digAddress } from "../abi/DigABI";
import { signer } from "../signer";

const digContract = new ethers.Contract(digAddress, digABI, signer);

const getBalanceOf = async (walletAddress: string) => {
  try {
    const balance = parseInt(
      (await digContract.balanceOf(walletAddress)).toString()
    );
    return balance;
  } catch (error) {
    console.log("getBalanceOf : ", error);
  }
};

const getTokens = async (walletAddress: string, balance = 0) => {
  try {
    if (balance <= 0) return [];
    const tokenIds = new Array(balance);
    for (let i = 0; i < balance; i++) {
      tokenIds[i] = (
        await digContract.tokenOfOwnerByIndex(walletAddress, i)
      ).toString();
    }
    return tokenIds;
  } catch (error) {
    console.log("getTokens : ", error);
  }
};

export { digContract, getBalanceOf, getTokens };
