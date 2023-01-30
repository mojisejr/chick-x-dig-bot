import { ethers } from "ethers";
import { digABI, digAddress } from "../abi/dig-abi";
import { signer } from "../signer";

const digContract = new ethers.Contract(digAddress, digABI, signer);

const getBalanceOf = async (walletAddress: string) => {
  const balance = parseInt(
    (await digContract.balanceOf(walletAddress)).toString()
  );
  return balance;
};

const getTokens = async (walletAddress: string, balance = 0) => {
  if (balance <= 0) return [];
  const tokenIds = new Array(balance);
  for (let i = 0; i < balance; i++) {
    tokenIds[i] = (
      await digContract.tokenOfOwnerByIndex(walletAddress, i)
    ).toString();
  }
  return tokenIds;
};

export { digContract, getBalanceOf, getTokens };
