import { Container, Table } from "nes-react";
import { FC, useEffect, useState } from "react";
import { FortressData } from "../metadata";
import { usePublicClient } from "wagmi";
import { roeABI } from "../contracts/RealmsOfEther";
import { ROE_CONTRACT_ADDRESS } from "../addresses";
type TroupsData = {
  dragonOfWisdom: bigint;
  dragonOfPower: bigint;
};

export const Troups: FC<{
  fortressData: FortressData | null;
}> = ({ fortressData }) => {
  const [troups, setTroups] = useState<TroupsData | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    const func = async () => {
      if (fortressData != null && publicClient != null) {
        const length = await publicClient.readContract({
          address: ROE_CONTRACT_ADDRESS,
          abi: roeABI,
          functionName: "getTroupIndexLength",
        });
        const troupsData: bigint[] = [];
        for (let i = 0; i < length; i++) {
          const troupHash = await publicClient.readContract({
            address: ROE_CONTRACT_ADDRESS,
            abi: roeABI,
            functionName: "getTroupHash",
            args: [BigInt(i)],
          });
          const result = await publicClient.readContract({
            address: ROE_CONTRACT_ADDRESS,
            abi: roeABI,
            functionName: "getFortressTroups",
            args: [fortressData.hash as `0x${string}`, troupHash],
          });
          troupsData.push(result);
        }
        setTroups({
          dragonOfPower: troupsData[0],
          dragonOfWisdom: troupsData[1],
        });
      }
    };
    func();
  }, [fortressData, publicClient]);

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
