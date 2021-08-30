import { FC, useState } from "react";
import {
  Container,
  Button,
  TextInput,
  Table,
  Sprite,
  Balloon,
} from "nes-react";

import { Row } from "./Row";
import {
  calculateNameRarity,
  calculateXRarity,
  calculateYear,
  calculateYearRarity,
  calculateYRarity,
  findFortress,
  findFortressNumber,
  FortressData,
} from "../metadata";
import { useQueryString } from "../utils/queryState";
import { useEffect } from "react";
import { useCallback } from "react";

const castle = require("../assets/castle.png").default;

export const App: FC = () => {
  const [xInput, setXInput] = useQueryString("x", "");
  const [yInput, setYInput] = useQueryString("y", "");
  const [searchResult, setSearchResult] = useState<
    FortressData | null | undefined
  >(null);

  useEffect(() => {
    if (xInput !== "" && yInput !== "") {
      displaySearchResult();
    }
  });

  const displaySearchResult = useCallback(() => {
    const f = findFortress(xInput as string, yInput as string);
    setSearchResult(f);
  }, [xInput, yInput]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: "1 0 auto",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 15,
        maxWidth: 1024,
        alignItems: "center",
      }}
    >
      <h1>Realms Of Ether Inspector</h1>
      <h4>Explore the traits of your fortress</h4>
      <div style={{ height: 20 }} />

      <Container rounded title="Search">
        <Row>
          <Container rounded>
            <img width={150} src={castle} alt="fortress" />
          </Container>
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              paddingLeft: "15px",
              paddingRight: "15px",
            }}
          >
            <TextInput
              label="X coordinate"
              value={xInput as string}
              // @ts-ignore
              onChange={(e) => setXInput(e.target.value)}
            />
            <TextInput
              label="Y coordinate"
              value={yInput as string}
              // @ts-ignore
              onChange={(e) => setYInput(e.target.value)}
            />
          </div>

          <Button
            primary
            // @ts-ignore
            onClick={displaySearchResult}
          >
            Search
          </Button>
        </Row>
      </Container>
      <div style={{ height: 20 }} />
      {searchResult === undefined && (
        <div style={{ display: "flex" }}>
          <Sprite
            sprite="kirby"
            // @ts-ignore
            style={{ alignSelf: "flex-end" }}
          />
          <Balloon
            // @ts-ignore
            style={{ margin: "2rem", maxWidth: "400px" }}
            fromLeft
          >
            {`No such fortress found!`}
          </Balloon>
        </div>
      )}
      {searchResult != null && (
        <>
          <div style={{ display: "flex" }}>
            <Sprite
              sprite="bcrikko"
              // @ts-ignore
              style={{ alignSelf: "flex-end" }}
            />
            <Balloon
              // @ts-ignore
              style={{ margin: "2rem", maxWidth: "400px" }}
              fromLeft
            >
              {`This is fortress #${findFortressNumber(
                searchResult.x,
                searchResult.y
              )}!`}
            </Balloon>
          </div>
          <div style={{ height: 40 }} />
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "row",
            }}
          >
            <Container rounded title="Traits">
              <Table dark bordered>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Rarity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{searchResult.name}</td>
                    <td>
                      {calculateNameRarity(searchResult.name)} has this trait
                    </td>
                  </tr>
                </tbody>
              </Table>
              <div style={{ height: 20 }} />
              <Table bordered>
                <thead>
                  <tr>
                    <th>Coord</th>
                    <th>Rarity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{searchResult.x}</td>
                    <td>{calculateXRarity(searchResult.x)} has this trait</td>
                  </tr>

                  <tr>
                    <td>{searchResult.y}</td>
                    <td>{calculateYRarity(searchResult.y)} has this trait</td>
                  </tr>
                </tbody>
              </Table>
              <div style={{ height: 20 }} />
              <Table bordered>
                <thead>
                  <tr>
                    <th>Foundation</th>
                    <th>Rarity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{calculateYear(searchResult.blockNumber)}</td>
                    <td>
                      {`${calculateYearRarity(
                        calculateYear(searchResult.blockNumber)
                      )}% has this trait`}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Container>
            <div style={{ display: "flex", flex: 1 }} />
          </div>
        </>
      )}
    </div>
  );
};
