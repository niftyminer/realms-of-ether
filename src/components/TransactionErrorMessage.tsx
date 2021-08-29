import React, { FC } from "react";

export const TransactionErrorMessage: FC<{
  message: string;
  dismiss: () => void;
}> = ({ message, dismiss }) => {
  return (
    <div className="alert alert-danger" role="alert">
      Error sending transaction: {message.substring(0, 100)}
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={dismiss}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};
