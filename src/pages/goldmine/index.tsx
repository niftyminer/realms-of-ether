import React, { FC, useEffect, useState } from "react";
import { Button, Checkbox, Container, Icon, Table } from "nes-react";
import { Row } from "../../components/Row";
import { metadata } from "../../metadata";
import { GOLD_CONTRACT_ADDRESS, ROE_WRAPPER_CONTRACT_ADDRESS } from "../../addresses";
import Link from "next/link";
import { goldABI } from "../../contracts/Gold";
import { useAccount, usePublicClient, useReadContract, useReadContracts, useWatchContractEvent, useWalletClient } from "wagmi";
import { roeWrapperABI } from "../../contracts/RealmsOfEtherWrapper";
import { formatEther, parseAbiItem, toHex } from "viem";

const gold = "/assets/gold.png";
const castle = "assets/castle.png";

const GoldMine: FC = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [approved, setApproved] = useState(false);
  const [rewards, setRewards] = useState<bigint>(0n);
  const [fortressIds, setFortressIds] = useState<Record<string, boolean>>({});
  const [rewardByStakeIds, setRewardByStakeIds] = useState<
    Record<string, bigint>
  >({});
  const [stakedIds, setStakedIds] = useState<bigint[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: goldBalance } = useReadContract({
    address: GOLD_CONTRACT_ADDRESS,
    abi: goldABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });

  const { data: tfl } = useReadContract({
    address: ROE_WRAPPER_CONTRACT_ADDRESS,
    abi: roeWrapperABI,
    functionName: "balanceOf",
    args: [GOLD_CONTRACT_ADDRESS],
  });

  const { data: fortressBalance } = useReadContract({
    address: ROE_WRAPPER_CONTRACT_ADDRESS,
    abi: roeWrapperABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });

  const { data: fortressIdsResult } = useReadContracts({
    contracts: (new Array(Number(fortressBalance || 0))).map((_, i) => ({
      address: ROE_WRAPPER_CONTRACT_ADDRESS as `0x${string}`,
      abi: roeWrapperABI,
      functionName: "tokenOfOwnerByIndex",
      args: [address, i],
    }))
  });

  useEffect(() => {
    if (fortressIdsResult != null) {
      const v = fortressIdsResult.filter((v): v is {status: "success", result: string} => v.status === "success");
      const updatedState = v.reduce((acc, v) => {
        acc[v.result] = false;
        return acc;
      }, {} as Record<string, boolean>);
      setFortressIds(updatedState);
    }
  }, [fortressIdsResult]);



  useWatchContractEvent({
    address: GOLD_CONTRACT_ADDRESS,
    abi: goldABI,
    eventName: "FortressStaked",
    fromBlock: 13319425n,
    onLogs: async (logs) => {
      const id = logs[0].args[0] as bigint;
      
      const staker = await publicClient?.readContract({
        address: GOLD_CONTRACT_ADDRESS,
        abi: goldABI,
        functionName: "getStaker",
        args: [id],
      });

      if (staker === address) {
        setStakedIds((currentValue) => {
          const hexValues = [...(currentValue ?? []), id].map((v) => v.toString());
          const uniqueHexValues = [...new Set([...hexValues])];
          return uniqueHexValues.map((uhv) => BigInt(uhv));
        });
      }
    }
  })


  const { data: goldSupply } = useReadContract({
    address: GOLD_CONTRACT_ADDRESS,
    abi: goldABI,
    functionName: "totalSupply",
  });

  // rewards
  useEffect(() => {
    const func = async () => {
      if (publicClient != null && stakedIds != null) {
        let sum = 0n;
        const updatedRewardByStakeIds: Record<string, bigint> = {};

        const rewards = await publicClient.multicall({
          contracts: stakedIds.map((id) => ({
            address: GOLD_CONTRACT_ADDRESS,
            abi: goldABI,
            functionName: "getRewardsByTokenId",
            args: [id],
          } as const)),
        });
        rewards
          .filter((r) : r is {status: "success", result: bigint} => r.status === "success")
          .forEach((reward, index) => {
            updatedRewardByStakeIds[stakedIds[index].toString()] = reward.result;
            sum += reward.result;
          });

        setRewards(sum);
        setRewardByStakeIds(updatedRewardByStakeIds);
        setIsLoading(false);
      }
    };
    func();
  }, [address, stakedIds]);

  // isApproved
  useEffect(() => {
    const func = async () => {
      if (publicClient != null && address != null) {
        const isApproved = await publicClient.readContract({
          address: ROE_WRAPPER_CONTRACT_ADDRESS,
          abi: roeWrapperABI,
          functionName: "isApprovedForAll",
          args: [address, GOLD_CONTRACT_ADDRESS],
        });
        setApproved(isApproved);
      }
    };
    func();
  }, [address]);

  const requestApproval = async () => {
    if (walletClient != null && publicClient != null) {
      const {request} = await publicClient.simulateContract({
        address: ROE_WRAPPER_CONTRACT_ADDRESS,
        abi: roeWrapperABI,
        functionName: "setApprovalForAll",
        args: [GOLD_CONTRACT_ADDRESS, true],
      });
      const tx  = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({hash: tx});
      setApproved(true);
    }
  };

  const startStaking = async () => {
    if (walletClient != null && publicClient != null) {
      const idsToStake = Object.entries(fortressIds)
      .filter(([_key, value]) => value === true)
      .map(([key, _value]) => key);

      const {request} = await publicClient.simulateContract({
        address: GOLD_CONTRACT_ADDRESS,
        abi: goldABI,
        functionName: "stakeByIds",
        args: [idsToStake.map((v) => BigInt(v))],
      });
      const tx = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({hash: tx});
      
      const updatedState = { ...fortressIds };
      for (const idToStake of idsToStake) {
        delete updatedState[idToStake];
      }
      setFortressIds(updatedState);
    }
  };

  const claimRewards = async () => {
    if (walletClient != null && publicClient != null && stakedIds != null) {
      const {request} = await publicClient.simulateContract({
        address: GOLD_CONTRACT_ADDRESS,
        abi: goldABI,
        functionName: "claimByTokenIds",
        args: [stakedIds],
      });
      const tx = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({hash: tx});
      setRewards(0n);
      setRewardByStakeIds((currentValue) => ({
        ...Object.fromEntries(
          Object.entries(currentValue).map(([k, _v]) => [k, 0n])
        ),
      }));
    }
  };

  const claimRewardsById = async (id: bigint) => {
    const reward = rewardByStakeIds[id.toString()];
    if (walletClient != null && publicClient != null) {
      const {request} = await publicClient.simulateContract({
        address: GOLD_CONTRACT_ADDRESS,
        abi: goldABI,
        functionName: "claimByTokenId",
        args: [id],
      });
      const tx = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({hash: tx});
    }
    setRewardByStakeIds((currentValue) => ({
      ...currentValue,
      [id.toString()]: 0n,
    }));
    setRewards((currentValue) => currentValue - reward);
  };

  const unstakeAll = async () => {
    if (walletClient != null && publicClient != null && stakedIds != null) {
      const {request} = await publicClient.simulateContract({
        address: GOLD_CONTRACT_ADDRESS,
        abi: goldABI,
        functionName: "unstakeByIds",
        args: [stakedIds],
      });
      const tx = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({hash: tx});
      setStakedIds([]);
    }
  };

  const unstakeById = async (id: bigint) => {
    if (walletClient != null && publicClient != null) {
      const {request} = await publicClient.simulateContract({
        address: GOLD_CONTRACT_ADDRESS,
        abi: goldABI,
        functionName: "unstakeByIds",
        args: [[id]],
      });
      const tx = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({hash: tx});
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          paddingBottom: 20,
        }}
      >
        <div style={{ paddingRight: 20 }}>
          <img width={30} height={38} src={gold} alt="gold" />
        </div>
        <div style={{ paddingRight: 20 }}>
          <img width={30} height={38} src={gold} alt="gold" />
        </div>
        <div style={{ paddingRight: 20 }}>
          <img width={30} height={38} src={gold} alt="gold" />
        </div>
        <div style={{ paddingRight: 20 }}>
          <img width={30} height={38} src={gold} alt="gold" />
        </div>
        <div style={{ paddingRight: 20 }}>
          <img width={30} height={38} src={gold} alt="gold" />
        </div>
        <div style={{ paddingRight: 20 }}>
          <img width={30} height={38} src={gold} alt="gold" />
        </div>
        <div style={{ paddingRight: 20 }}>
          <img width={30} height={38} src={gold} alt="gold" />
        </div>
        <div style={{ paddingRight: 20 }}>
          <img width={30} height={38} src={gold} alt="gold" />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "80%",
          alignItems: "center",
        }}
      >
        <Container rounded centered>
          Welcome Ruler of the Realm! If you are looking for treasure, you came
          to the right place. If you hand over the keys to your Castle, you will
          earn GOLD, until you reclaim your fortress.
          <br />
          <br /> Only a{" "}
          <Link href="/goldmine/faq">
            <a>fortune teller</a>
          </Link>{" "}
          could tell, what all this means...
        </Container>
        <div style={{ padding: 30 }}>
          {!approved && (
            <Button
              warning
              // @ts-ignore
              onClick={requestApproval}
            >
              Allow the Gold Mine to handle your fortress
            </Button>
          )}
        </div>
        {approved && (
          <>
            <div style={{ paddingBottom: 30 }}>
              <Container rounded title="Stake">
                <Row>
                  <Container rounded>
                    <img width={150} src={castle} alt="fortress" />
                  </Container>
                  <div
                    style={{
                      paddingLeft: "15px",
                      paddingRight: "15px",
                    }}
                  >
                    {Object.entries(fortressIds).map(([id, value]) => {
                      const fortress = metadata.find(
                        (data) => data.hash === id
                      );
                      return (
                        <Checkbox
                          key={id}
                          checked={value}
                          label={`x: ${fortress?.x} y: ${fortress?.y}`}
                          onSelect={async () => {
                            setFortressIds({ ...fortressIds, [id]: !value });
                          }}
                        />
                      );
                    })}
                  </div>
                </Row>
                <Button
                  success
                  disabled={
                    Object.values(fortressIds).filter((v) => v === true)
                      .length === 0
                  }
                  // @ts-ignore
                  onClick={startStaking}
                >
                  Start Earning
                </Button>
              </Container>
            </div>
            <Container rounded title="Dashboard">
              <div style={{ padding: 20 }}>
                <Table bordered>
                  <tbody style={{ whiteSpace: "nowrap" }}>
                    <tr>
                      <td>Total GOLD supply</td>
                      <td>
                        <div style={{ display: "flex", flexWrap: "nowrap" }}>
                          {goldSupply != null ? limitDecimals(formatEther(goldSupply)) : "0"}{" "}
                          <img width={20} src={gold} alt="gold" />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Total Fortresses Locked</td>
                      <td>
                        <div style={{ display: "flex", flexWrap: "nowrap" }}>
                          {tfl}
                          <img height={20} src={castle} alt="gold" />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>My GOLD balance</td>
                      <td>
                        <div style={{ display: "flex", flexWrap: "nowrap" }}>
                          {goldBalance != null ? limitDecimals(formatEther(goldBalance)) : "0"}{" "}
                          <img width={20} src={gold} alt="gold" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              {isLoading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                  className="spinner"
                >
                  <Icon icon="star" medium />
                  <span>Loading...</span>
                  <Icon icon="star" medium />
                </div>
              ) : (
                <>
                  <div
                    style={{ padding: 20, paddingTop: 10, paddingBottom: 10 }}
                  >
                    <Container rounded title="Overview">
                      <Table bordered>
                        <thead style={{ whiteSpace: "nowrap" }}>
                          <tr>
                            <th>Fortresses</th>
                            <th>Rewards</th>
                            <th>Claim All</th>
                            <th>Unstake All</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{stakedIds?.length}</td>
                            <td>
                              <div
                                style={{ display: "flex", flexWrap: "nowrap" }}
                              >
                                {rewards != null ? limitDecimals(formatEther(rewards)) : "0"}{" "}
                                <img width={20} src={gold} alt="gold" />
                              </div>
                            </td>
                            <td>
                              <Button
                                primary
                                // @ts-ignore
                                onClick={claimRewards}
                              >
                                Claim
                              </Button>
                            </td>
                            <td>
                              <Button
                                error
                                // @ts-ignore
                                onClick={unstakeAll}
                              >
                                Unstake
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Container>
                  </div>
                  <div style={{ padding: 20 }}>
                    <Container rounded title="Details">
                      <Table bordered>
                        <thead style={{ whiteSpace: "nowrap" }}>
                          <tr>
                            <th>Fortress</th>
                            <th>Rewards</th>
                            <th>Collect</th>
                            <th>Unstake</th>
                          </tr>
                        </thead>
                        <tbody style={{ whiteSpace: "nowrap" }}>
                          {stakedIds?.map((id) => {
                            const fortress = metadata.find(
                              (data) => data.hash === toHex(id)
                            );
                            return (
                              <tr key={id.toString()}>
                                <td>{`x: ${fortress?.x} y: ${fortress?.y}`}</td>
                                <td>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexWrap: "nowrap",
                                    }}
                                  >
                                    {rewardByStakeIds?.[id.toString()] != null
                                      ? limitDecimals(
                                          formatEther(
                                            rewardByStakeIds?.[id.toString()]
                                          )
                                        )
                                      : "0"}{" "}
                                    <img width={20} src={gold} alt="gold" />
                                  </div>
                                </td>
                                <td>
                                  <Button
                                    primary
                                    // @ts-ignore
                                    onClick={() => claimRewardsById(id)}
                                  >
                                    Collect
                                  </Button>
                                </td>
                                <td>
                                  <Button
                                    error
                                    // @ts-ignore
                                    onClick={() => unstakeById(id)}
                                  >
                                    Unstake
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </Container>
                  </div>
                </>
              )}
            </Container>
          </>
        )}
        <div style={{ paddingTop: 30 }}>
          <h5 style={{ textAlign: "center" }}>
            Disclaimer: this is a community project, built for the kings and
            queens of RoE. It is not built on the original mechanics of the
            game, GOLD is an ERC20 token.
          </h5>
        </div>
      </div>
    </>
  );
};

const limitDecimals = (str: string) => {
  if (str.includes(".")) {
    const parts = str.split(".");
    return parts[0] + "." + parts[1].slice(0, 5);
  } else {
    return str;
  }
};

export default GoldMine;
