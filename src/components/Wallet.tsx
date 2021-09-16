import { Button } from "nes-react";
import { FC } from "react";

import { NetworkErrorMessage } from "./NetworkErrorMessage";

export const Wallet: FC<{
  connectWallet: () => void;
  networkError: any;
  dismiss: () => void;
  address: string | undefined;
}> = ({ connectWallet, networkError, dismiss, address }) => {
  return (
    <div>
      <Button
        // @ts-ignore
        onClick={(e) => {
          connectWallet();
        }}
        style={{
          maxWidth: "300px",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {address ?? "Connect Wallet"}
      </Button>

      <div>
        {networkError && (
          <NetworkErrorMessage message={networkError} dismiss={dismiss} />
        )}
      </div>
    </div>
  );
};
