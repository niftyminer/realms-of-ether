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
      <button onClick={(e) => connectWallet()}>Connect Wallet</button>

      <div>
        {networkError && (
          <NetworkErrorMessage message={networkError} dismiss={dismiss} />
        )}
      </div>
    </>
  );
};
