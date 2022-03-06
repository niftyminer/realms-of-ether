import { FC, useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { Wallet } from "./Wallet";
import { getEthereumClient } from "../utils/ethereum";
import { roeABI } from "../contracts/RealmsOfEther";
import { roeWrapperABI } from "../contracts/RealmsOfEtherWrapper";
import { goldABI } from "../contracts/Gold";
import { Container, Icon } from "nes-react";
import { Donation } from "./Donation";
import {
  GOLD_CONTRACT_ADDRESS,
  ROE_CONTRACT_ADDRESS,
  ROE_WRAPPER_CONTRACT_ADDRESS,
} from "../addresses";
import { EtherContext } from "../context/EtherContext";

export const Layout: FC = ({ children }) => {
  const [networkError, setNetworkError] = useState<string | undefined>();
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>();
  const [roeContract, setRoeContract] = useState<undefined | ethers.Contract>();
  const [roeWrapperContract, setRoeWrapperContract] = useState<
    undefined | ethers.Contract
  >();
  const [goldContract, setGoldContract] = useState<
    undefined | ethers.Contract
  >();

  const resetState = useCallback(() => {
    setSelectedAddress(undefined);
    setNetworkError(undefined);
  }, []);

  const intializeEthers = useCallback(() => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum,
      "any"
    );

    setRoeWrapperContract(
      new ethers.Contract(
        ROE_WRAPPER_CONTRACT_ADDRESS,
        roeWrapperABI,
        provider.getSigner(0)
      )
    );
    setRoeContract(
      new ethers.Contract(ROE_CONTRACT_ADDRESS, roeABI, provider.getSigner(0))
    );
    setGoldContract(
      new ethers.Contract(GOLD_CONTRACT_ADDRESS, goldABI, provider.getSigner(0))
    );
  }, []);

  const initialize = useCallback(
    (userAddress: string) => {
      setSelectedAddress(userAddress);
      intializeEthers();
    },
    [intializeEthers]
  );

  useEffect(() => {
    async function getSelectedAddress() {
      const [selectedAddress] = await getEthereumClient().request({
        method: "eth_accounts",
      });
      if (selectedAddress) {
        initialize(selectedAddress);
      }
    }
    getSelectedAddress();
  }, []);

  const connectWallet = useCallback(async () => {
    const [selectedAddress] = await getEthereumClient().request({
      method: "eth_requestAccounts",
    });
    initialize(selectedAddress);

    getEthereumClient().on("accountsChanged", ([newAddress]: [string]) => {
      if (newAddress === undefined) {
        return resetState();
      }

      initialize(newAddress);
    });

    getEthereumClient().on("networkChanged", ([networkId]: [string]) => {
      resetState();
    });
  }, [initialize, resetState]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 600,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Link href="/inspect">
            <a style={{ textDecoration: "none", color: "black" }}>
              <h3>Inspector</h3>
            </a>
          </Link>
          <Link href="/goldmine">
            <a style={{ textDecoration: "none", color: "black" }}>
              <h3>Gold Mine</h3>
            </a>
          </Link>
          <Link href="/learn">
            <a style={{ textDecoration: "none", color: "black" }}>
              <h3>Learn</h3>
            </a>
          </Link>

          <a
            href="https://mango-puck-2f0.notion.site/Realms-DAO-4db97df04c8f4cf8a5e163abff56e266"
            style={{ textDecoration: "none", color: "black" }}
            target="_blank"
          >
            <h3>DAO</h3>
          </a>
        </div>
        <Wallet
          address={selectedAddress}
          connectWallet={connectWallet}
          networkError={networkError}
          dismiss={() => setNetworkError(undefined)}
        />
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 15,
        }}
      >
        <Link href="/">
          <a style={{ textDecoration: "none", color: "black" }}>
            <h1>Realms Of Ether Revive</h1>
          </a>
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: "1 0 auto",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 15,
          maxWidth: "95%",
          alignItems: "center",
        }}
      >
        <EtherContext.Provider
          value={{
            selectedAddress,
            roeContract,
            goldContract,
            roeWrapperContract,
          }}
        >
          {children}
        </EtherContext.Provider>
      </div>
      <Donation />
      <div
        style={{
          display: "flex",
          flex: 1,
          flexShrink: 0,
          paddingTop: 20,
          paddingBottom: 20,
          alignItems: "center",
          maxWidth: 1200,
        }}
      >
        <Container title="Credits" rounded>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3>nifty_miner</h3>
            <div style={{ paddingLeft: 10, paddingRight: 10 }}>
              <a
                href="https://twitter.com/nifty_miner"
                target="_blank"
                rel="noreferrer"
              >
                <Icon icon={"twitter"} />
              </a>
            </div>
            <div style={{ paddingLeft: 5, paddingRight: 10 }}>
              <h3>
                Check out{" "}
                <a
                  href="https://opensea.io/collection/realms-of-ether-1"
                  target="_blank"
                  rel="noreferrer"
                >
                  OpenSea
                </a>{" "}
                for fortresses
              </h3>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};
