import { FC, useState, useEffect, useCallback, useContext } from "react";
import { BigNumber, Contract } from "ethers";
import { findFortress, FortressData } from "../../metadata";
import { useQueryString } from "../../utils/queryState";
import { Resources } from "../../components/Resources";
import { Traits } from "../../components/Traits";
import { Realms } from "../../components/Realms";
import { FoundMessage } from "../../components/FoundMessage";
import { Search } from "../../components/Search";
import { Troups } from "../../components/Troups";
import { Buildings } from "../../components/Buildings";
import { EtherContext } from "../../context/EtherContext";
import { useRouter } from "next/dist/client/router";

export const Inspector: FC = () => {
  const router = useRouter();
  const { selectedAddress, roeContract, roeWrapperContract } =
    useContext(EtherContext);
  const [xInput, yInput] = getCoords(router.query["coords"]);
  const setCoords = useCallback(
    (x, y) => {
      router.push(`/inspect/${x}:${y}/`, undefined, { shallow: true });
    },
    [router]
  );
  const [searchResult, setSearchResult] = useState<
    FortressData | null | undefined
  >(null);
  const [ownerFortressHashes, setOwnerFortressHashes] = useState<string[]>([]);
  const [numberOfWrapped, setNumberOfWrapped] = useState<null | number>(null);

  useEffect(() => {
    if (xInput !== "" && yInput !== "") {
      setSearchResult(findFortress(xInput as string, yInput as string));
    }
  }, [xInput, yInput]);

  useEffect(() => {
    let isSubscribed = true;
    const func = async () => {
      if (roeWrapperContract != null) {
        const balance = await roeWrapperContract.balanceOf(selectedAddress);
        const ownedFortressHashes: string[] = [];

        for (let ind = 0; ind < balance; ind++) {
          const result: BigNumber =
            await roeWrapperContract.tokenOfOwnerByIndex(selectedAddress, ind);
          ownedFortressHashes.push(result.toHexString());
        }

        isSubscribed && setOwnerFortressHashes(ownedFortressHashes);

        const ts = await roeWrapperContract.totalSupply();
        const totalSupply = ts.toNumber();
        isSubscribed && setNumberOfWrapped(totalSupply);
      }
    };
    func();
    return () => void (isSubscribed = false);
  }, [roeWrapperContract, selectedAddress]);

  return (
    <>
      <h3>Explore the traits of your fortress</h3>
      <Search
        xInput={xInput}
        yInput={yInput}
        setCoords={setCoords}
        searchResult={searchResult}
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
        handleSelectTile={setCoords}
      />
    </>
  );
};

function getCoords(coords?: string | string[]): [string?, string?] {
  if (!coords) {
    return [, ,];
  }
  return coords.toString().split(":").slice(0, 2) as [string?, string?];
}

export default Inspector;
