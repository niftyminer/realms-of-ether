import { FC, useCallback, useEffect, useState } from "react";
import { Container, TextInput, Button } from "nes-react";
import { Row } from "./Row";
import { FortressData } from "../metadata";
import { hexToString } from "viem";

export const Search: FC<{
  searchResult: FortressData | null | undefined;
  xInput?: string;
  yInput?: string;
  setCoords: (x?: string, y?: string) => void;
}> = ({ searchResult, xInput, yInput, setCoords }) => {
  const [x, setX] = useState(xInput ?? "");
  const [y, setY] = useState(yInput ?? "");
  useEffect(() => {
    setX(xInput ?? "");
    setY(yInput ?? "");
  }, [xInput, yInput]);
  const handleXChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setX(e.target.value), []);
  const handleYChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setY(e.target.value), []);
  const handleSearch = useCallback(() => setCoords(x, y), [x, y, setCoords]);
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
              value={x as string}
              onChange={handleXChange as () => void}
            />
            <TextInput
              label="Y coordinate"
              value={y as string}
              onChange={handleYChange as () => void}
            />
          </div>

          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
            }}
          >
            <Button primary {...{ onClick: handleSearch }}>
              Search
            </Button>
            <div style={{ paddingTop: "15px", paddingLeft: "10px" }}>
              {searchResult != null && (
                <a
                  href={`https://opensea.io/assets/0x8479277aacff4663aa4241085a7e27934a0b0840/${hexToString(
                    searchResult.hash as `0x${string}`
                  )}`}
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
