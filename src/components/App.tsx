import { FC, useState, useCallback } from "react";
import { ethers } from "ethers";
import { Switch, Route, NavLink } from "react-router-dom";

import { Wallet } from "./Wallet";
import { getEthereumClient } from "../utils/ethereum";
import { roeABI } from "../contracts/RealmsOfEther";
import { roeWrapperABI } from "../contracts/RealmsOfEtherWrapper";
import { Button, Container, Icon } from "nes-react";
import { Inspector } from "../pages/Inspector";
import { Learn } from "../pages/Learn";
import { Donation } from "./Donation";

const ROE_CONTRACT_ADDRESS = "0x0716d44d5991b15256A2de5769e1376D569Bba7C";
const ROE_WRAPPER_CONTRACT_ADDRESS =
  "0x8479277AaCFF4663Aa4241085a7E27934A0b0840";

export const App: FC = () => {
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>();
  const [networkError, setNetworkError] = useState<string | undefined>();
  const [roeContract, setRoeContract] = useState<undefined | ethers.Contract>();
  const [roeWrapperContract, setRoeWrapperContract] = useState<
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
  }, []);

  const initialize = useCallback(
    (userAddress: string) => {
      setSelectedAddress(userAddress);
      intializeEthers();
    },
    [intializeEthers]
  );

  const connectWallet = useCallback(async () => {
    const [selectedAddress] = await getEthereumClient().enable();
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
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 15,
        }}
      >
        <NavLink to="/" style={{ textDecoration: "none", color: "black" }}>
          <h1>Realms Of Ether Inspector</h1>
        </NavLink>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <NavLink
            to="/learn"
            style={{ textDecoration: "none", color: "black" }}
          >
            <Button>Learn</Button>
          </NavLink>
          <Wallet
            address={selectedAddress}
            connectWallet={() => connectWallet()}
            networkError={networkError}
            dismiss={() => setNetworkError(undefined)}
          />
        </div>
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
        <Switch>
          <Route path="/learn">
            <Learn />
          </Route>
          <Route path="/">
            <Inspector
              selectedAddress={selectedAddress}
              roeContract={roeContract}
              roeWrapperContract={roeWrapperContract}
            />
          </Route>
        </Switch>
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
