import { FC } from "react";
import { Button } from "nes-react";
import { getEthereumClient } from "../utils/ethereum";
import { GOLD_CONTRACT_ADDRESS } from "../addresses";

const tokenSymbol = "GOLD";
const tokenDecimals = 18;
const tokenImage = "https://i.imgur.com/YcsVSTR.png";

export const addToken = async () => {
  try {
    const ethereum = getEthereumClient();
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20", // Initially only supports ERC20, but eventually more!
        options: {
          address: GOLD_CONTRACT_ADDRESS, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    });

    if (wasAdded) {
      console.log("Thanks for your interest!");
    } else {
      console.log("Your loss!");
    }
    return wasAdded;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const AddToken: FC = ({ children }) => {
  return (
    <Button
      primary
      // @ts-ignore
      onClick={async (e) => {
        e.preventDefault();
        await addToken();
      }}
    >
      {children}
    </Button>
  );
};
