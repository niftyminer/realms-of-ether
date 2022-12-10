import React, { FC, useContext, useEffect, useState } from "react";
import { BigNumber, constants, ethers, Event } from "ethers";
import { Button, Checkbox, Container, Icon, Table } from "nes-react";
import { Row } from "../../components/Row";
import { metadata } from "../../metadata";
import { GOLD_CONTRACT_ADDRESS } from "../../addresses";
import { formatEther } from "@ethersproject/units";
import { EtherContext } from "../../context/EtherContext";
import Link from "next/link";
import { Contract, Provider } from 'ethers-multicall';
import { goldABI } from "../../contracts/Gold";

const gold = "/assets/gold.png";
const castle = "assets/castle.png";

const GoldMine: FC = () => {
  const { selectedAddress, goldContract, roeWrapperContract } =
    useContext(EtherContext);

  const [approved, setApproved] = useState(false);
  const [rewards, setRewards] = useState(constants.Zero);
  const [goldBalance, setGoldBalance] = useState("0");
  const [tfl, setTfl] = useState("0");
  const [goldSupply, setGoldSupply] = useState("0");
  const [fortressIds, setFortressIds] = useState<Record<string, boolean>>({});
  const [rewardByStakeIds, setRewardByStakeIds] = useState<
    Record<string, BigNumber>
  >({});
  const [stakedIds, setStakedIds] = useState<BigNumber[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // gold balance
  useEffect(() => {
    const func = async () => {
      if (goldContract != null) {
        const balance: BigNumber = await goldContract.balanceOf(
          selectedAddress
        );
        setGoldBalance(balance.toString());
      }
    };
    func();
  }, [goldContract, selectedAddress, rewards, rewardByStakeIds]);

  // total fortresses locked
  useEffect(() => {
    const func = async () => {
      if (roeWrapperContract != null) {
        const balance: BigNumber = await roeWrapperContract.balanceOf(
          GOLD_CONTRACT_ADDRESS
        );
        setTfl(balance.toString());
      }
    };
    func();
  }, [roeWrapperContract, selectedAddress, stakedIds]);

  // setFortresses
  useEffect(() => {
    const func = async () => {
      if (roeWrapperContract != null) {
        const balance = await roeWrapperContract.balanceOf(selectedAddress);
        const fortressIds: Record<string, boolean> = {};

        for (let ind = 0; ind < balance; ind++) {
          const result: BigNumber =
            await roeWrapperContract.tokenOfOwnerByIndex(selectedAddress, ind);
          fortressIds[result.toHexString()] = false;
        }
        setFortressIds(fortressIds);
      }
    };
    func();
  }, [roeWrapperContract, selectedAddress, stakedIds]);

  // setStakeIds
  useEffect(() => {
    const func = async () => {
      if (goldContract != null) {
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum,
          "any"
        );
    
        const ethcallProvider = new Provider(provider);

        await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
      
        goldContract.on(
          goldContract.filters.FortressStaked(),
          async (id: BigNumber) => {
            const staker = (await goldContract.getStaker(id)).toLowerCase();
            if (staker === selectedAddress) {
              setStakedIds((currentValue) => {
                const hexValues = [...(currentValue ?? []), id].map((v) =>
                  v.toString()
                );
                const uniqueHexValues = [...new Set([...hexValues])];
                return uniqueHexValues.map((uhv) => BigNumber.from(uhv));
              });
            }
          }
        );
        const eventFilter = goldContract.filters.FortressStaked();
        const events = await goldContract.queryFilter(eventFilter);
        const allStakedIds = events.map((e: Event) => e?.args?.[0]);
        const stakedForSelectedAddress: BigNumber[] = [];

        // multicall gold 
        const multicallGoldContract = new Contract(GOLD_CONTRACT_ADDRESS, goldABI);
        const allStakers = await ethcallProvider.all(allStakedIds.map((id: string) => multicallGoldContract.getStaker(id)));
        allStakers.map((staker: string) => staker.toLowerCase()).forEach((staker, index) => {
          if (staker === selectedAddress) {
            stakedForSelectedAddress.push(allStakedIds[index]);
          }
        })

        const hexValues = stakedForSelectedAddress.map((v) => v.toString());
        const uniqueHexValues = [...new Set([...hexValues])];

        setStakedIds(uniqueHexValues.map((uhv) => BigNumber.from(uhv)));
      }
    };
    func();

    return () => {
      goldContract?.removeAllListeners();
    };
  }, [goldContract, selectedAddress]);

  // gold supply
  useEffect(() => {
    const func = async () => {
      if (goldContract != null) {
        const supply: BigNumber = await goldContract.totalSupply();
        setGoldSupply(supply.toString());
      }
    };
    func();
  }, [goldContract, selectedAddress, stakedIds, rewards, rewardByStakeIds]);

  // rewards
  useEffect(() => {
    const func = async () => {
      if (goldContract != null && stakedIds != null) {
        let sum = constants.Zero;
        const updatedRewardByStakeIds: Record<string, BigNumber> = {};

        for (const stakedId of stakedIds) {
          const reward = await goldContract.getRewardsByTokenId(stakedId);
          updatedRewardByStakeIds[stakedId.toString()] = reward;
          sum = sum.add(reward);
        }
        setRewards(sum);
        setRewardByStakeIds(updatedRewardByStakeIds);
        setIsLoading(false);
      }
    };
    func();
  }, [goldContract, selectedAddress, stakedIds]);

  // isApproved
  useEffect(() => {
    const func = async () => {
      if (roeWrapperContract != null) {
        const isApproved = await roeWrapperContract.isApprovedForAll(
          selectedAddress,
          GOLD_CONTRACT_ADDRESS
        );
        setApproved(isApproved);
      }
    };
    func();
  }, [roeWrapperContract, selectedAddress]);

  const requestApproval = async () => {
    if (roeWrapperContract != null) {
      const tx = await roeWrapperContract?.setApprovalForAll(
        GOLD_CONTRACT_ADDRESS,
        true
      );
      await tx.wait();
      setApproved(true);
    }
  };

  const startStaking = async () => {
    const idsToStake = Object.entries(fortressIds)
      .filter(([_key, value]) => value === true)
      .map(([key, _value]) => key);

    await goldContract?.stakeByIds(idsToStake);
    const updatedState = { ...fortressIds };
    for (const idToStake of idsToStake) {
      delete updatedState[idToStake];
    }
    setFortressIds(updatedState);
  };

  const claimRewards = async () => {
    const tx = await goldContract?.claimByTokenIds(
      stakedIds?.map((id) => id.toString())
    );
    await tx.wait();
    setRewards(constants.Zero);
    setRewardByStakeIds((currentValue) => ({
      ...Object.fromEntries(
        Object.entries(currentValue).map(([k, _v]) => [k, constants.Zero])
      ),
    }));
  };

  const claimRewardsById = async (id: BigNumber) => {
    const reward = rewardByStakeIds[id.toString()];
    const tx = await goldContract?.claimByTokenId(id.toString());
    await tx.wait();
    setRewardByStakeIds((currentValue) => ({
      ...currentValue,
      [id.toString()]: constants.Zero,
    }));
    setRewards((currentValue) => currentValue.sub(reward));
  };

  const unstakeAll = async () => {
    await goldContract?.unstakeByIds(stakedIds?.map((id) => id.toString()));
    setStakedIds([]);
  };

  const unstakeById = async (id: BigNumber) => {
    await goldContract?.unstakeByIds([id.toString()]);
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
                          {limitDecimals(formatEther(goldSupply))}{" "}
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
                          {limitDecimals(formatEther(goldBalance))}{" "}
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
                                {limitDecimals(formatEther(rewards))}{" "}
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
                              (data) => data.hash === id.toHexString()
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
