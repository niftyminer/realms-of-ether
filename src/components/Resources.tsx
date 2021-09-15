import { Contract } from "@ethersproject/contracts";
import { Container, Table } from "nes-react";
import { FC, useEffect, useState } from "react";
import { FortressData } from "../metadata";

type ResourceData = {
  gold: string;
  stone: string;
  wood: string;
};

export const Resources: FC<{
  contract: Contract | undefined;
  fortressData: FortressData | null;
}> = ({ contract, fortressData }) => {
  const [resources, setResources] = useState<ResourceData | null>(null);

  useEffect(() => {
    const func = async () => {
      if (contract != null && fortressData != null) {
        const result = await contract.getResources(fortressData.hash);
        setResources({
          gold: result._gold.toString(),
          stone: result._stone.toString(),
          wood: result._wood.toString(),
        });
      }
    };
    func();
  }, [fortressData, contract]);

  if (resources == null) {
    return null;
  }
  return (
    <div style={{ padding: 20 }}>
      <Container rounded title="Resources">
        <Table bordered>
          <thead>
            <tr>
              <th>Resource</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gold</td>
              <td>{resources.gold}</td>
            </tr>
            <tr>
              <td>Stone</td>
              <td>{resources.stone}</td>
            </tr>
            <tr>
              <td>Wood</td>
              <td>{resources.wood}</td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </div>
  );
};
