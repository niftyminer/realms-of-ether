import { FC } from "react";

export const WaitingForTransactionMessage: FC<{ txHash: string }> = (props) => {
  return (
    <div>
      Transaction <strong>{props.txHash}</strong> is being mined...
    </div>
  );
};
