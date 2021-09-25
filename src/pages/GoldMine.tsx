import { FC, useEffect, useState } from "react";
import { BigNumber, constants, Contract, Event } from "ethers";
import { Button, Checkbox, Container, Table } from "nes-react";
import { Row } from "../components/Row";
import { metadata } from "../metadata";
import { GOLD_CONTRACT_ADDRESS } from "../addresses";
import { formatEther } from "@ethersproject/units";

const gold = require("../assets/gold.png").default;
const castle = require("../assets/castle.png").default;

export const GoldMine: FC<{
  selectedAddress: string | undefined;
  goldContract: Contract | undefined;
  roeWrapperContract: Contract | undefined;
}> = ({ selectedAddress, goldContract, roeWrapperContract }) => {
  const [approved, setApproved] = useState(false);
  const [rewards, setRewards] = useState("0");
  const [goldBalance, setGoldBalance] = useState("0");
  const [fortressIds, setFortressIds] = useState<Record<string, boolean>>({});
  const [stakedIds, setStakedIds] = useState<BigNumber[]>([]);

  // gold balance
  useEffect(() => {
    const func = async () => {
      if (goldContract != null) {
        const balance: BigNumber = await goldContract.balanceOf(
          selectedAddress
        );
        console.log("gold balance", balance);
        setGoldBalance(balance.toString());
      }
    };
    func();
  }, [goldContract, selectedAddress, rewards]);

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
        goldContract.on(
          goldContract.filters.FortressStaked(),
          async (id: BigNumber) => {
            const staker = (await goldContract.getStaker(id)).toLowerCase();
            if (staker === selectedAddress) {
              setStakedIds((currentValue) => [...currentValue, id]);
            }
          }
        );
        const eventFilter = goldContract.filters.FortressStaked();
        const events = await goldContract.queryFilter(eventFilter);
        console.log(events);
        const allStakedIds = events.map((e: Event) => e?.args?.[0]);
        const stakedForSelectedAddress: BigNumber[] = [];
        for (const id of allStakedIds) {
          const staker = (await goldContract.getStaker(id)).toLowerCase();
          console.log("staker", staker);
          console.log("selectedAddress", selectedAddress);
          if (staker === selectedAddress) {
            stakedForSelectedAddress.push(id);
          }
        }
        setStakedIds(stakedForSelectedAddress);
      }
    };
    func();

    return () => {
      goldContract?.removeAllListeners();
    };
  }, [goldContract, selectedAddress]);

  useEffect(() => {
    console.log(stakedIds);
  }, [stakedIds]);

  // rewards
  useEffect(() => {
    const func = async () => {
      if (goldContract != null) {
        let sum = constants.Zero;
        for (const stakedId of stakedIds) {
          const reward = await goldContract.getRewardsByTokenId(stakedId);
          sum = sum.add(reward);
        }
        setRewards(formatEther(sum));
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
        console.log("isapproved", isApproved);
        setApproved(isApproved);
      }
    };
    func();
  }, [roeWrapperContract, selectedAddress]);

  const requestApproval = async () => {
    await roeWrapperContract?.setApprovalForAll(GOLD_CONTRACT_ADDRESS, true);
    setApproved(true);
  };

  const startStaking = async () => {
    const idsToStake = Object.entries(fortressIds)
      .filter(([_key, value]) => value === true)
      .map(([key, _value]) => key);
    console.log(idsToStake);
    await goldContract?.stakeByIds(idsToStake);
    const updatedState = { ...fortressIds };
    for (const idToStake of idsToStake) {
      delete updatedState[idToStake];
    }
    setFortressIds(updatedState);
  };

  const claimRewards = async () => {
    console.log(stakedIds);
    const tx = await goldContract?.claimByTokenIds(
      stakedIds.map((id) => id.toHexString())
    );
    await tx.wait();
    setRewards("0");
  };

  const unstakeAll = async () => {
    await goldContract?.unstakeByIds([stakedIds]);
    setStakedIds([]);
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
        <h3>Gold Mine</h3>
        <div style={{ paddingLeft: 20 }}>
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
          Welcome castle owner! If you are looking for treasure, you came to
          just the right place. If you hand over the keys to your Castle, you
          will earn GOLD, until you reclaim your fortress.
          <br />
          <br /> Only a fortune teller could tell, what you would do with all
          that GOLD...
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
                  // const fortress = metadata.find((data) => data.hash === id);
                  return (
                    <Checkbox
                      key={id}
                      checked={value}
                      //  label={`x: ${fortress?.x} y: ${fortress?.y}`}
                      label={`name: ${id}`}
                      onSelect={async () => {
                        const owner = await roeWrapperContract?.ownerOf(id);
                        console.log("owner", owner);
                        setFortressIds({ ...fortressIds, [id]: !value });
                      }}
                    />
                  );
                })}
              </div>
            </Row>
            <Button
              success
              // @ts-ignore
              onClick={startStaking}
            >
              Start Earning
            </Button>
          </Container>
        </div>
        <Container rounded title="Dashboard">
          <div style={{ paddingBottom: 20 }}>
            <Table bordered>
              <tbody style={{ whiteSpace: "nowrap" }}>
                <tr>
                  <td>Gold balance</td>
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
                <td>{stakedIds.length}</td>
                <td>
                  <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    {limitDecimals(rewards)}{" "}
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
          {/* <Container rounded title="Details">
            <Table bordered>
              <thead style={{ whiteSpace: "nowrap" }}>
                <tr>
                  <th>Fortress ID</th>
                  <th>Rewards</th>
                  <th>Collect</th>
                  <th>Unstake</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>141424234</td>
                  <td>
                    45 <img width={20} src={gold} alt="gold" />
                  </td>
                  <td>
                    <Button primary>Collect</Button>
                  </td>
                  <td>
                    <Button error>Unstake</Button>
                  </td>
                </tr>
                <tr>
                  <td>141424234</td>
                  <td>
                    45 <img width={20} src={gold} alt="gold" />
                  </td>
                  <td>
                    <Button primary>Collect</Button>
                  </td>
                  <td>
                    <Button error>Unstake</Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Container> */}
          <div style={{ height: 20 }} />
        </Container>
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
