import { FC, useState, useEffect, useCallback } from "react";
import { BigNumber, Contract } from "ethers";
import { findFortress, FortressData } from "../metadata";
import { useQueryString } from "../utils/queryState";
import { Resources } from "../components/Resources";
import { Traits } from "../components/Traits";
import { Realms } from "../components/Realms";
import { FoundMessage } from "../components/FoundMessage";
import { Search } from "../components/Search";
import { Troups } from "../components/Troups";
import { Buildings } from "../components/Buildings";

export const Inspector: FC<{
  selectedAddress: string | undefined;
  roeContract: Contract | undefined;
  roeWrapperContract: Contract | undefined;
}> = ({ selectedAddress, roeContract, roeWrapperContract }) => {
  const [xInput, setXInput] = useQueryString("x", "");
  const [yInput, setYInput] = useQueryString("y", "");
  const [searchResult, setSearchResult] = useState<
    FortressData | null | undefined
  >(null);
  const [ownerFortressHashes, setOwnerFortressHashes] = useState<string[]>([]);
  const [numberOfWrapped, setNumberOfWrapped] = useState<null | number>(null);

  const displaySearchResult = useCallback(() => {
    const f = findFortress(xInput as string, yInput as string);
    setSearchResult(f);
  }, [xInput, yInput]);

  useEffect(() => {
    if (xInput !== "" && yInput !== "") {
      displaySearchResult();
    }
  }, [displaySearchResult, xInput, yInput]);

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

  return (
    <>
      <h3>Explore the traits of your fortress</h3>
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
          <h4>{`Fortresses wrapped: ${numberOfWrapped}/500`}</h4>
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
            <div>
              <Resources contract={roeContract} fortressData={searchResult} />
              <Buildings contract={roeContract} fortressData={searchResult} />
              <Troups contract={roeContract} fortressData={searchResult} />
            </div>
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
    </>
  );
};
