import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "ethers";
import { Container, Table } from "nes-react";
import { FC, useEffect, useState } from "react";
import { FortressData } from "../metadata";

type BuildingsData = {
  goldMine: number;
  timberCamp: number;
  stonePit: number;
  towerOfDragons: number;
  dragonCavern: number;
};

const BROKEN_BUILDING =
  "0x013fe665d081d447d18c02806c23234ff4e64e732fa7a5814abc87a0dac86737";

export const Buildings: FC<{
  contract: Contract | undefined;
  fortressData: FortressData | null;
}> = ({ contract, fortressData }) => {
  const [buildings, setBuildings] = useState<BuildingsData | null>(null);

  useEffect(() => {
    const func = async () => {
      if (contract != null && fortressData != null) {
        setBuildings(null);
        const length = await contract.getBuildingIndexLength();
        const buildingsData: { _level: BigNumber }[] = [];
        for (let i = 0; i < length; i++) {
          const buildingHash = await contract.getBuildingHash(i);
          if (buildingHash === BROKEN_BUILDING) {
            continue;
          }
          const result = await contract.getFortressBuilding(
            fortressData.hash,
            buildingHash
          );
          buildingsData.push(result);
        }

        setBuildings({
          goldMine: buildingsData[0]._level.toNumber(),
          timberCamp: buildingsData[1]._level.toNumber(),
          stonePit: buildingsData[2]._level.toNumber(),
          towerOfDragons: buildingsData[3]._level.toNumber(),
          dragonCavern: buildingsData[4]._level.toNumber(),
        });
      }
    };
    func();
  }, [fortressData, contract]);

  if (buildings == null) {
    return null;
  }
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
              <td>{buildings.goldMine}</td>
            </tr>
            <tr>
              <td>Timber Camp</td>
              <td>{buildings.timberCamp}</td>
            </tr>
            <tr>
              <td>Stone Pit</td>
              <td>{buildings.stonePit}</td>
            </tr>
            <tr>
              <td>Tower of Dragons</td>
              <td>{buildings.towerOfDragons}</td>
            </tr>
            <tr>
              <td>Dragon Cavern</td>
              <td>{buildings.dragonCavern}</td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </div>
  );
};
