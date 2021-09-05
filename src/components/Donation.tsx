import { Button, Icon } from "nes-react";
import { FC, useState } from "react";

export const Donation: FC = () => {
  const [label, setLabel] = useState("0x128...d3a2");
  return (
    <h5 style={{ textAlign: "center" }}>
      Made with
      <Icon icon="heart" />
      You can support the development with donating ETH:
      <Button
        // @ts-ignore
        onClick={() => {
          navigator.clipboard.writeText(
            "0x1282f34438cB205D201DD357398b85E7729Dd3a2"
          );
          setLabel("0x128...COPIED");
          setTimeout(() => setLabel("0x128...d3a2"), 4000);
        }}
      >
        {label}
      </Button>
    </h5>
  );
};
