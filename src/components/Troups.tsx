import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "ethers";
import { Container, Table } from "nes-react";
import { FC, useEffect, useState } from "react";
import { FortressData } from "../metadata";

type TroupsData = {
  dragonOfWisdom: number;
  dragonOfPower: number;
};

export const Troups: FC<{
  contract: Contract | undefined;
  fortressData: FortressData | null;
}> = ({ contract, fortressData }) => {
  const [troups, setTroups] = useState<TroupsData | null>(null);

  useEffect(() => {
    const func = async () => {
      if (contract != null && fortressData != null) {
        const length = await contract.getTroupIndexLength();
        const troupsData: BigNumber[] = [];
        for (let i = 0; i < length; i++) {
          const troupHash = await contract.getTroupHash(i);
          const result = await contract.getFortressTroups(
            fortressData.hash,
            troupHash
          );
          troupsData.push(result);
        }
        setTroups({
          dragonOfPower: troupsData[0].toNumber(),
          dragonOfWisdom: troupsData[1].toNumber(),
        });
      }
    };
    func();
  }, [fortressData, contract]);

  if (troups == null) {
    return null;
  }
  return (
    <div style={{ padding: 10 }}>
      <Container rounded title="Troups">
        <Table bordered>
          <thead>
            <tr>
              <th>Troup</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Dragon of Wisdom</td>
              <td>{troups.dragonOfWisdom}</td>
            </tr>
            <tr>
              <td>Dragon of Power</td>
              <td>{troups.dragonOfPower}</td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </div>
  );
};
