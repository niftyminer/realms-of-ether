import { FC } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { Container, TextInput, Button } from "nes-react";
import { Row } from "./Row";
import { FortressData } from "../metadata";

export const Search: FC<{
  searchResult: FortressData | null | undefined;
  xInput: string;
  yInput: string;
  setXInput: (x: string) => void;
  setYInput: (y: string) => void;

  displaySearchResult: () => void;
}> = ({
  searchResult,
  xInput,
  yInput,
  displaySearchResult,
  setXInput,
  setYInput,
}) => {
  return (
    <div style={{ padding: 10 }}>
      <Container rounded title="Search">
        <Row>
          <Container rounded>
            <img width={150} src="/assets/castle.png" alt="fortress" />
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

          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
            }}
          >
            <Button
              primary
              // @ts-ignore
              onClick={displaySearchResult}
            >
              Search
            </Button>
            <div style={{ paddingTop: "15px", paddingLeft: "10px" }}>
              {searchResult != null && (
                <a
                  href={`https://opensea.io/assets/0x8479277aacff4663aa4241085a7e27934a0b0840/${BigNumber.from(
                    searchResult.hash
                  ).toBigInt()}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on OpenSea
                </a>
              )}
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
};
