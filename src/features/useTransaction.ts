import { useCallback, useState } from "react";

const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

export const useContractCall = (contractFunction: () => Promise<any>) => {
  const [transactionError, setTransactionError] = useState<any>();
  const [txBeingSent, setTxBeingSent] = useState<string | undefined>();

  const contractCall = useCallback(async () => {
    try {
      setTransactionError(undefined);
      const tx = await contractFunction();
      setTxBeingSent(tx.hash);

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that make the transaction fail once it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }

      // If we got here, the transaction was successful, so you may want to
      // update your state. Here, we update the user's balance.
      //  await this._updatePrice();
    } catch (error: any) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      setTransactionError(error);
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      setTxBeingSent(undefined);
    }
  }, [contractFunction]);

  return { contractCall, transactionError, setTransactionError, txBeingSent };
};
