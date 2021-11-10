import React from "react";
import { ethers } from "ethers";

type EContext = {
  selectedAddress?: string;
  roeContract?: ethers.Contract;
  goldContract?: ethers.Contract;
  roeWrapperContract?: ethers.Contract;
};

export const EtherContext = React.createContext<EContext>({});
