import { FC, useState } from "react";
import { Container, Button, TextInput } from "nes-react";

import { Row } from "./Row";
import { findFortress, FortressData } from "../metadata";
import { useQueryString } from "../utils/queryState";
import { useEffect } from "react";
import { useCallback } from "react";
import { BigNumber, ethers } from "ethers";
import { Wallet } from "./Wallet";
import { getEthereumClient } from "../utils/ethereum";
import { roeABI } from "../contracts/RealmsOfEther";
import { roeWrapperABI } from "../contracts/RealmsOfEtherWrapper";
import { Donation } from "./Donation";
import { Resources } from "./Resources";
import { Traits } from "./Traits";
import { Realms } from "./Realms";
import { FoundMessage } from "./FoundMessage";
import { Search } from "./Search";

const ROE_CONTRACT_ADDRESS = "0x0716d44d5991b15256A2de5769e1376D569Bba7C";
const ROE_WRAPPER_CONTRACT_ADDRESS =
  "0x8479277AaCFF4663Aa4241085a7E27934A0b0840";

export const App: FC = () => {
  const [xInput, setXInput] = useQueryString("x", "");
  const [yInput, setYInput] = useQueryString("y", "");
  const [searchResult, setSearchResult] = useState<
    FortressData | null | undefined
  >(null);
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>();
  const [ownerFortressHashes, setOwnerFortressHashes] = useState<string[]>([]);
  const [networkError, setNetworkError] = useState<string | undefined>();
  const [roeContract, setRoeContract] = useState<undefined | ethers.Contract>();
  const [roeWrapperContract, setRoeWrapperContract] = useState<
    undefined | ethers.Contract
  >();

  const [numberOfWrapped, setNumberOfWrapped] = useState<null | number>(null);

  const resetState = useCallback(() => {
    setSelectedAddress(undefined);
    setNetworkError(undefined);
    setOwnerFortressHashes([]);
  }, []);

  const displaySearchResult = useCallback(() => {
    const f = findFortress(xInput as string, yInput as string);
    setSearchResult(f);
  }, [xInput, yInput]);

  useEffect(() => {
    if (xInput !== "" && yInput !== "") {
      displaySearchResult();
    }
  }, [displaySearchResult, xInput, yInput]);

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

  useEffect(() => {
    const func = async () => {
      if (roeWrapperContract != null) {
        const balance = await roeWrapperContract.balanceOf(selectedAddress);
        const ownedFortressHashes: string[] = [];

        for (let ind = 0; ind < balance; ind++) {
          const result: BigNumber =
            await roeWrapperContract.tokenOfOwnerByIndex(selectedAddress, ind);
          ownedFortressHashes.push(result.toHexString());
        }

        setOwnerFortressHashes(ownedFortressHashes);

        const ts = await roeWrapperContract.totalSupply();
        const totalSupply = ts.toNumber();
        setNumberOfWrapped(totalSupply);
      }
    };
    func();
  }, [roeWrapperContract, selectedAddress]);

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
        display: "flex",
        flexDirection: "column",
        flex: "1 0 auto",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 15,
        maxWidth: 1024,
        alignItems: "center",
      }}
    >
      <h1>Realms Of Ether Inspector</h1>
      <h4>Explore the traits of your fortress</h4>

      <Wallet
        address={selectedAddress}
        connectWallet={() => connectWallet()}
        networkError={networkError}
        dismiss={() => setNetworkError(undefined)}
      />
      <Search
        xInput={xInput}
        yInput={yInput}
        setXInput={setXInput}
        setYInput={setYInput}
        searchResult={searchResult}
        displaySearchResult={displaySearchResult}
      />
      <div style={{ padding: 10 }}>
        {numberOfWrapped != null && (
          <h3>{`Fortresses wrapped: ${numberOfWrapped}/500`}</h3>
        )}
      </div>
      <FoundMessage fortressData={searchResult} />
      <div style={{ height: 40 }} />
      {searchResult != null && (
        <>
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <Traits fortressData={searchResult} />
            <Resources contract={roeContract} fortressData={searchResult} />
            <div style={{ display: "flex", flex: 1 }} />
          </div>
          <div style={{ height: 20 }} />
        </>
      )}
      <Realms
        fortressData={searchResult}
        ownerHashes={ownerFortressHashes}
        handleSelectTile={(x, y) => {
          window.history.pushState(
            "",
            "",
            `${window.location.href.split("?")[0]}?x=${x}&y=${y}`
          );
          setXInput(x);
          setYInput(y);
        }}
      />
      <div style={{ height: 20 }} />
      <Donation />
    </div>
  );
};
