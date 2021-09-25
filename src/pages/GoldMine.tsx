import { FC, useState } from "react";
import { Contract } from "ethers";
import { Button, Container, List, Table, TextInput } from "nes-react";
import { Row } from "../components/Row";

const gold = require("../assets/gold.png").default;
const castle = require("../assets/castle.png").default;

export const GoldMine: FC<{
  selectedAddress: string | undefined;
  roeContract: Contract | undefined;
  roeWrapperContract: Contract | undefined;
}> = ({ selectedAddress, roeContract, roeWrapperContract }) => {
  const [id, setId] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [approved, setApproved] = useState(false);

  const updateSelectedIds = () => {
    if (id !== "" && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
      setId("");
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
              onClick={() => setApproved(true)}
            >
              Allow me to take care of your fortress
            </Button>
          )}
        </div>
        <div>
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
                <TextInput
                  label="Fortress ID"
                  value={id}
                  // @ts-ignore
                  onChange={(e) => setId(e.target.value)}
                />
                <Button
                  primary
                  // @ts-ignore
                  onClick={updateSelectedIds}
                >
                  Add
                </Button>
              </div>
            </Row>
            <List solid>
              {selectedIds.map((selectedId) => (
                <li>{selectedId}</li>
              ))}
            </List>
          </Container>
        </div>
        <div style={{ padding: 30 }}>
          <Button
            success
            // @ts-ignore
            onClick={() => setApproved(true)}
          >
            Start Earning
          </Button>
        </div>
        <Container rounded title="Dashboard">
          <Container rounded title="Overview">
            <Table bordered>
              <thead style={{ whiteSpace: "nowrap" }}>
                <tr>
                  <th>Fortresses</th>
                  <th>Rewards</th>
                  <th>Collect All</th>
                  <th>Unstake All</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>4</td>
                  <td>
                    452 <img width={20} src={gold} alt="gold" />
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
          </Container>
          <div style={{ height: 20 }} />
          <Container rounded title="Details">
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
          </Container>
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
