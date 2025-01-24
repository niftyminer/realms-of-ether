import { Container, Table } from "nes-react";
import { FC, useEffect, useState } from "react";
import { FortressData } from "../metadata";
import { usePublicClient } from "wagmi";
import { ROE_CONTRACT_ADDRESS } from "../addresses";
import { roeABI } from "../contracts/RealmsOfEther";

type ResourceData = {
  gold: string;
  stone: string;
  wood: string;
};

export const Resources: FC<{
  fortressData: FortressData | null;
}> = ({ fortressData }) => {
  const [resources, setResources] = useState<ResourceData | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    const func = async () => {
      if (fortressData != null && publicClient != null) {
        const result = await publicClient.readContract({
          address: ROE_CONTRACT_ADDRESS,
          abi: roeABI,
          functionName: "getResources",
          args: [fortressData.hash as `0x${string}`],
        });
        setResources({
          gold: result[0].toString(),
          stone: result[1].toString(),
          wood: result[2].toString(),
        });
      }
    };
    func();
  }, [fortressData, publicClient]);

  if (resources == null) {
    return null;
  }
  return (
    <div style={{ padding: 10 }}>
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
