import { FC, useState } from "react";
import {
  Container,
  Button,
  TextInput,
  Table,
  Sprite,
  Balloon,
  Progress,
} from "nes-react";

import { Row } from "./Row";
import {
  calculateNameRarity,
  calculateXRarity,
  calculateYear,
  calculateYearRarity,
  calculateYRarity,
  findFortress,
  findFortressNumber,
  FortressData,
  metadata,
} from "../metadata";
import { useQueryString } from "../utils/queryState";
import { useEffect } from "react";
import { useCallback } from "react";
import { BigNumber, ethers } from "ethers";
import { Wallet } from "./Wallet";
import { getEthereumClient } from "../utils/ethereum";
import { roeABI } from "../contracts/RealmsOfEther";
import { roeWrapperABI } from "../contracts/RealmsOfEtherWrapper";

const castle = require("../assets/castle.png").default;

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
  const [wrappedFortressHashes, setWrappedFortressHashes] = useState<string[]>(
    []
  );
  const [networkError, setNetworkError] = useState<string | undefined>();
  const [roeContract, setRoeContract] = useState<undefined | ethers.Contract>();
  const [roeWrapperContract, setRoeWrapperContract] = useState<
    undefined | ethers.Contract
  >();

  const [numberOfWrapped, setNumberOfWrapped] = useState<null | number>(null);
  const [progress, setProgress] = useState(0);

  const resetState = useCallback(() => {
    setSelectedAddress(undefined);
    setNetworkError(undefined);
    setOwnerFortressHashes([]);
    setWrappedFortressHashes([]);
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
        const fortressHashes: string[] = [];

        for (let ind = 0; ind < totalSupply; ind++) {
          const result: BigNumber = await roeWrapperContract.tokenByIndex(ind);
          fortressHashes.push(result.toHexString());
          console.log(fortressHashes);
          setWrappedFortressHashes((current) => [
            ...current,
            result.toHexString(),
          ]);
          setProgress(ind);
        }
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
      <div style={{ height: 20 }} />
      <Container rounded title="Search">
        <Row>
          <Container rounded>
            <img width={150} src={castle} alt="fortress" />
          </Container>
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              paddingLeft: "15px",
              paddingRight: "15px",
            }}
          >
            <TextInput
              label="X coordinate"
              value={xInput as string}
              // @ts-ignore
              onChange={(e) => setXInput(e.target.value)}
            />
            <TextInput
              label="Y coordinate"
              value={yInput as string}
              // @ts-ignore
              onChange={(e) => setYInput(e.target.value)}
            />
          </div>

          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
            }}
          >
            <Button
              primary
              // @ts-ignore
              onClick={displaySearchResult}
            >
              Search
            </Button>
            <div style={{ paddingTop: "15px", paddingLeft: "10px" }}>
              {searchResult != null && (
                <a
                  href={`https://opensea.io/assets/0x8479277aacff4663aa4241085a7e27934a0b0840/${BigNumber.from(
                    searchResult.hash
                  ).toBigInt()}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on OpenSea
                </a>
              )}
            </div>
          </div>
        </Row>
      </Container>
      <div style={{ height: 20 }} />
      {searchResult === undefined && (
        <div style={{ display: "flex" }}>
          <Sprite
            sprite="kirby"
            // @ts-ignore
            style={{ alignSelf: "flex-end" }}
          />
          <Balloon
            // @ts-ignore
            style={{ margin: "2rem", maxWidth: "400px" }}
            fromLeft
          >
            {`No such fortress found!`}
          </Balloon>
        </div>
      )}
      {searchResult != null && (
        <>
          <div style={{ display: "flex" }}>
            <Sprite
              sprite="bcrikko"
              // @ts-ignore
              style={{ alignSelf: "flex-end" }}
            />
            <Balloon
              // @ts-ignore
              style={{ margin: "2rem", maxWidth: "400px" }}
              fromLeft
            >
              {`This is fortress #${findFortressNumber(
                searchResult.x,
                searchResult.y
              )}!`}
            </Balloon>
          </div>
          <div style={{ height: 40 }} />
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "row",
            }}
          >
            <Container rounded title="Traits">
              <Table dark bordered>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Rarity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{searchResult.name}</td>
                    <td>
                      {calculateNameRarity(searchResult.name)} has this trait
                    </td>
                  </tr>
                </tbody>
              </Table>
              <div style={{ height: 20 }} />
              <Table bordered>
                <thead>
                  <tr>
                    <th>Coord</th>
                    <th>Rarity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{searchResult.x}</td>
                    <td>{calculateXRarity(searchResult.x)} has this trait</td>
                  </tr>

                  <tr>
                    <td>{searchResult.y}</td>
                    <td>{calculateYRarity(searchResult.y)} has this trait</td>
                  </tr>
                </tbody>
              </Table>
              <div style={{ height: 20 }} />
              <Table bordered>
                <thead>
                  <tr>
                    <th>Foundation</th>
                    <th>Rarity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{calculateYear(searchResult.blockNumber)}</td>
                    <td>
                      {`${calculateYearRarity(
                        calculateYear(searchResult.blockNumber)
                      )}% has this trait`}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Container>
            <div style={{ display: "flex", flex: 1 }} />
          </div>
          <div style={{ height: 20 }} />
        </>
      )}
      {numberOfWrapped != null && (
        <>
          <Progress value={progress} max={numberOfWrapped} warning />
          <div style={{ height: 20 }} />
        </>
      )}
      <Container rounded title="Realms">
        <Button primary>Owned</Button>
        <Button success>Wrapped</Button>
        <Table bordered>
          <tbody>
            {rows.map((y) => {
              return (
                <tr key={y}>
                  {columns.map((x) => {
                    const fortress = metadata.find(
                      (f) => f.x === x.toString() && f.y === y.toString()
                    );

                    return (
                      <td
                        className="tooltip"
                        data-text={
                          fortress != null
                            ? `index: ${findFortressNumber(x, y)}
name: ${fortress.name}
position: x: ${fortress.x} y: ${fortress.y}
`
                            : x === "0" && y === "0"
                            ? "Ether"
                            : "Emptiness"
                        }
                        style={{
                          backgroundColor:
                            fortress != null &&
                            ownerFortressHashes.includes(fortress.hash)
                              ? "violet"
                              : fortress != null &&
                                wrappedFortressHashes.includes(fortress.hash)
                              ? "blue"
                              : undefined,
                        }}
                        key={x}
                      >
                        {x === "0" && y === "0" ? (
                          "Ξ"
                        ) : metadata.find(
                            (f) => f.x === x.toString() && f.y === y.toString()
                          ) != null ? (
                          <button
                            style={{
                              margin: -8,
                              border: 0,
                              backgroundColor: "transparent",
                            }}
                            onClick={() => {
                              window.history.pushState(
                                "",
                                "",
                                `${
                                  window.location.href.split("?")[0]
                                }?x=${x}&y=${y}`
                              );
                              setXInput(x);
                              setYInput(y);
                            }}
                          >
                            F
                          </button>
                        ) : (
                          "x"
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

const columns = [
  "-12",
  "-11",
  "-10",
  "-9",
  "-8",
  "-7",
  "-6",
  "-5",
  "-4",
  "-3",
  "-2",
  "-1",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

const rows = [...columns].reverse();
