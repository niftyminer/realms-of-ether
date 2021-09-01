import { FC } from "react";

import { NetworkErrorMessage } from "./NetworkErrorMessage";

export const Wallet: FC<{
  connectWallet: () => void;
  networkError: any;
  dismiss: () => void;
  address: string | undefined;
}> = ({ connectWallet, networkError, dismiss, address }) => {
  return (
    <>
      <button
        onClick={(e) => {
          connectWallet();
        }}
        style={{
          maxWidth: "200px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {address ?? "Connect Wallet"}
      </button>

      <div>
        {networkError && (
          <NetworkErrorMessage message={networkError} dismiss={dismiss} />
        )}
      </div>
    </>
  );
};
