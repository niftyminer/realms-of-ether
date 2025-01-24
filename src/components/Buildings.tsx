import { Container, Table } from "nes-react";
import { FC, useEffect, useState } from "react";
import { FortressData } from "../metadata";
import { usePublicClient } from "wagmi";
import { ROE_CONTRACT_ADDRESS } from "../addresses";
import { roeABI } from "../contracts/RealmsOfEther";

type BuildingsData = {
  goldMine: bigint;
  timberCamp: bigint;
  stonePit: bigint;
  towerOfDragons: bigint;
  dragonCavern: bigint;
};

const BROKEN_BUILDING =
  "0x013fe665d081d447d18c02806c23234ff4e64e732fa7a5814abc87a0dac86737";

export const Buildings: FC<{
  fortressData: FortressData | null;
}> = ({ fortressData }) => {
  const [buildings, setBuildings] = useState<BuildingsData | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    const func = async () => {
      if (fortressData != null && publicClient != null) {
        setBuildings(null);
        const length = await publicClient.readContract({
          address: ROE_CONTRACT_ADDRESS,
          abi: roeABI,
          functionName: "getBuildingIndexLength",
        });
        const buildingsData: { _level: bigint }[] = [];
        for (let i = 0; i < length; i++) {
          const buildingHash = await publicClient.readContract({
            address: ROE_CONTRACT_ADDRESS,
            abi: roeABI,
            functionName: "getBuildingHash",
            args: [BigInt(i)],
          });
          if (buildingHash === BROKEN_BUILDING) {
            continue;
          }
          const result = await publicClient.readContract({
            address: ROE_CONTRACT_ADDRESS,
            abi: roeABI,
            functionName: "getFortressBuilding",
            args: [fortressData.hash as `0x${string}`, buildingHash],
          });
          buildingsData.push({
            _level: result[1],
          });
        }

        setBuildings({
          goldMine: buildingsData[0]._level,
          timberCamp: buildingsData[1]._level,
          stonePit: buildingsData[2]._level,
          towerOfDragons: buildingsData[3]._level,
          dragonCavern: buildingsData[4]._level,
        });
      }
    };
    func();
  }, [fortressData, publicClient]);

  return (
    <div style={{ padding: 10 }}>
      <Container rounded title="Buildings">
        <Table bordered>
          <thead>
            <tr>
              <th>Building</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gold Mine</td>
              <td>{buildings && buildings.goldMine}</td>
            </tr>
            <tr>
              <td>Timber Camp</td>
              <td>{buildings && buildings.timberCamp}</td>
            </tr>
            <tr>
              <td>Stone Pit</td>
              <td>{buildings && buildings.stonePit}</td>
            </tr>
            <tr>
              <td>Tower of Dragons</td>
              <td>{buildings && buildings.towerOfDragons}</td>
            </tr>
            <tr>
              <td>Dragon Cavern</td>
              <td>{buildings && buildings.dragonCavern}</td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </div>
  );
};
