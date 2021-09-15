import { Sprite, Balloon } from "nes-react";
import { FC } from "react";
import { findFortressNumber, FortressData } from "../metadata";

export const FoundMessage: FC<{
  fortressData: FortressData | null | undefined;
}> = ({ fortressData }) => {
  if (fortressData == null) {
    return (
      <div style={{ display: "flex" }}>
        <Sprite
          sprite="kirby"
          // @ts-ignore
          style={{ alignSelf: "flex-end" }}
        />
        <Balloon
          // @ts-ignore
          style={{ margin: "2rem", maxWidth: "500px" }}
          fromLeft
        >
          {`No such fortress found!`}
        </Balloon>
      </div>
    );
  } else {
    return (
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
            fortressData.x,
            fortressData.y
          )}!`}
        </Balloon>
      </div>
    );
  }
};
