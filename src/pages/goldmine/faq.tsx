import { Balloon } from "nes-react";
import { FC } from "react";
import { AddToken } from "../../components/AddToken";

const dragonOfWisdom = "/assets/dragon_of_wisdom.png";
const dragonOfPower = "/assets/dragon_of_power.png";

const FAQ: FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <img
          width={150}
          height={150}
          src={dragonOfPower}
          alt={"dragon-of-power"}
        />
        <Balloon
          // @ts-ignore
          style={{ margin: "2rem", marginBottom: "5rem", maxWidth: "500px" }}
          fromLeft
        >
          {`What's the Gold Mine?`}
        </Balloon>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <Balloon
          // @ts-ignore
          style={{ margin: "2rem", marginBottom: "5rem", maxWidth: "400px" }}
          fromRight
        >
          {`The Gold Mine is a smart contract where you can stake your RoE fortress to earn GOLD, an ERC20 token.`}
        </Balloon>
        <img
          width={150}
          height={150}
          src={dragonOfWisdom}
          alt={"dragon-of-wisdom"}
        />
      </div>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <img
          width={150}
          height={150}
          src={dragonOfPower}
          alt={"dragon-of-power"}
        />
        <Balloon
          // @ts-ignore
          style={{ margin: "2rem", marginBottom: "5rem", maxWidth: "500px" }}
          fromLeft
        >
          {`Can I see the GOLD in MetaMask?`}
        </Balloon>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <Balloon
          // @ts-ignore
          style={{ margin: "2rem", marginBottom: "5rem", maxWidth: "400px" }}
          fromRight
        >
          {`Yes, just press this button: `}
          <AddToken>Add GOLD to MetaMask</AddToken>
        </Balloon>
        <img
          width={150}
          height={150}
          src={dragonOfWisdom}
          alt={"dragon-of-wisdom"}
        />
      </div>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <img
          width={150}
          height={150}
          src={dragonOfPower}
          alt={"dragon-of-power"}
        />
        <Balloon
          // @ts-ignore
          style={{ margin: "2rem", marginBottom: "5rem", maxWidth: "500px" }}
          fromLeft
        >
          {`What can I do with GOLD?`}
        </Balloon>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <Balloon
          // @ts-ignore
          style={{ margin: "2rem", marginBottom: "5rem", maxWidth: "400px" }}
          fromRight
        >
          {`There are rumours around the Realms, that it could be used to buy certain things, eventually.`}
        </Balloon>
        <img
          width={150}
          height={150}
          src={dragonOfWisdom}
          alt={"dragon-of-wisdom"}
        />
      </div>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <img
          width={150}
          height={150}
          src={dragonOfPower}
          alt={"dragon-of-power"}
        />
        <Balloon
          // @ts-ignore
          style={{ margin: "2rem", marginBottom: "5rem", maxWidth: "500px" }}
          fromLeft
        >
          {`Are any integrations planned for GOLD?`}
        </Balloon>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <Balloon
          // @ts-ignore
          style={{ margin: "2rem", marginBottom: "5rem", maxWidth: "400px" }}
          fromRight
        >
          {`GOLD is intended to be used elsewhere in the metaverse, and integrations are being pursued.`}
        </Balloon>
        <img
          width={150}
          height={150}
          src={dragonOfWisdom}
          alt={"dragon-of-wisdom"}
        />
      </div>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <img
          width={150}
          height={150}
          src={dragonOfPower}
          alt={"dragon-of-power"}
        />
        <Balloon
          // @ts-ignore
          style={{ margin: "2rem", marginBottom: "5rem", maxWidth: "500px" }}
          fromLeft
        >
          {`How much GOLD are we talking about?`}
        </Balloon>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <Balloon
          // @ts-ignore
          style={{ margin: "2rem", marginBottom: "5rem", maxWidth: "400px" }}
          fromRight
        >
          {`In the first months there'll be plenty of gold in the mine, for every castle approx. 5 GOLD can be earned daily. After ~ 1st of November it'll be 2 GOLD / castle / day.`}
        </Balloon>
        <img
          width={150}
          height={150}
          src={dragonOfWisdom}
          alt={"dragon-of-wisdom"}
        />
      </div>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <img
          width={150}
          height={150}
          src={dragonOfPower}
          alt={"dragon-of-power"}
        />
        <Balloon
          // @ts-ignore
          style={{ margin: "2rem", marginBottom: "5rem", maxWidth: "500px" }}
          fromLeft
        >
          {`What is the difference between claiming and unstaking?`}
        </Balloon>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <Balloon
          // @ts-ignore
          style={{ margin: "2rem", marginBottom: "5rem", maxWidth: "400px" }}
          fromRight
        >
          {`With claiming you obtain the GOLD you were rewarded, with unstaking you are claiming and removing your fortress from the contract - won't be eligible for rewards after that.`}
        </Balloon>
        <img
          width={150}
          height={150}
          src={dragonOfWisdom}
          alt={"dragon-of-wisdom"}
        />
      </div>
    </div>
  );
};

export default FAQ;
