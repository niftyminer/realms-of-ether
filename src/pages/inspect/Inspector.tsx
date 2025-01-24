import { FC, useState, useEffect, useCallback } from "react";
import { findFortress, FortressData } from "../../metadata";
import { Resources } from "../../components/Resources";
import { Traits } from "../../components/Traits";
import { Realms } from "../../components/Realms";
import { FoundMessage } from "../../components/FoundMessage";
import { Search } from "../../components/Search";
import { Troups } from "../../components/Troups";
import { Buildings } from "../../components/Buildings";
import { useRouter } from "next/dist/client/router";
import { useAccount, usePublicClient } from "wagmi";
import { ROE_WRAPPER_CONTRACT_ADDRESS } from "../../addresses";
import { roeWrapperABI } from "../../contracts/RealmsOfEtherWrapper";
import { toHex } from "viem";

export const Inspector: FC = () => {
  const router = useRouter();
  const { address } = useAccount();
  const publicClient = usePublicClient();
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
  const [numberOfWrapped, setNumberOfWrapped] = useState<null | bigint>(null);

  useEffect(() => {
    if (xInput !== "" && yInput !== "") {
      setSearchResult(findFortress(xInput as string, yInput as string));
    }
  }, [xInput, yInput]);

  useEffect(() => {
    let isSubscribed = true;
    const func = async () => {
      if (publicClient != null) {
        const balance = await publicClient.readContract({
          address: ROE_WRAPPER_CONTRACT_ADDRESS,
          abi: roeWrapperABI,
          functionName: "balanceOf",
          args: [address as `0x${string}`],
        });
        const ownedFortressHashes: string[] = [];

        for (let ind = 0; ind < balance; ind++) {
          const result =
            await publicClient.readContract({
              address: ROE_WRAPPER_CONTRACT_ADDRESS,
              abi: roeWrapperABI,
              functionName: "tokenOfOwnerByIndex",
              args: [address as `0x${string}`, BigInt(ind)],
            });
          ownedFortressHashes.push(toHex(result));
        }

        isSubscribed && setOwnerFortressHashes(ownedFortressHashes);

        const totalSupply = await publicClient.readContract({
          address: ROE_WRAPPER_CONTRACT_ADDRESS,
          abi: roeWrapperABI,
          functionName: "totalSupply",
        });
        isSubscribed && setNumberOfWrapped(totalSupply);
      }
    };
    func();
    return () => void (isSubscribed = false);
  }, [publicClient, address]);

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
              <Resources fortressData={searchResult} />
              <Buildings fortressData={searchResult} />
              <Troups fortressData={searchResult} />
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
