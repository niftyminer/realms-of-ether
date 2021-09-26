import { Sprite, Balloon } from "nes-react";
import { FC } from "react";

export const FAQ: FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
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
          {`What's the Gold Mine?`}
        </Balloon>
      </div>
      <div style={{ display: "flex" }}>
        <Balloon
          // @ts-ignore
          style={{ margin: "2rem", maxWidth: "400px" }}
          fromRight
        >
          {`The Gold Mine is a smart contract where you can stake your RoE fortress to earn GOLD, an ERC20 token.`}
        </Balloon>
        <Sprite
          sprite="bcrikko"
          // @ts-ignore
          style={{ alignSelf: "flex-end" }}
        />
      </div>
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
          {`What can I do with GOLD?`}
        </Balloon>
      </div>
      <div style={{ display: "flex" }}>
        <Balloon
          // @ts-ignore
          style={{ margin: "2rem", maxWidth: "400px" }}
          fromRight
        >
          {`There are rumours around the Realms, that it could be used to buy certain things, eventually.`}
        </Balloon>
        <Sprite
          sprite="bcrikko"
          // @ts-ignore
          style={{ alignSelf: "flex-end" }}
        />
      </div>
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
          {`How much GOLD are we talking about?`}
        </Balloon>
      </div>
      <div style={{ display: "flex" }}>
        <Balloon
          // @ts-ignore
          style={{ margin: "2rem", maxWidth: "400px" }}
          fromRight
        >
          {`In the first months there'll be plenty of gold in the mine, for every castle approx. 5 GOLD can be earned daily. After ~ 1st of November it'll be 2 GOLD / castle / day.`}
        </Balloon>
        <Sprite
          sprite="bcrikko"
          // @ts-ignore
          style={{ alignSelf: "flex-end" }}
        />
      </div>
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
          {`What is the difference between claiming and unstaking?`}
        </Balloon>
      </div>
      <div style={{ display: "flex" }}>
        <Balloon
          // @ts-ignore
          style={{ margin: "2rem", maxWidth: "400px" }}
          fromRight
        >
          {`With claiming you obtain the GOLD you were rewarded, with unstaking you are claiming and removing your fortress from the contract - won't be eligible for rewards after that.`}
        </Balloon>
        <Sprite
          sprite="bcrikko"
          // @ts-ignore
          style={{ alignSelf: "flex-end" }}
        />
      </div>
    </div>
  );
};
