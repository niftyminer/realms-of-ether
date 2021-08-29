import React, { FC } from "react";

export const Transfer: FC<{
  transferTokens: (to: string, amount: string) => void;
  tokenSymbol: string;
}> = ({ transferTokens, tokenSymbol }) => {
  return (
    <div>
      <h4>Transfer</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target as any);
          const to = formData.get("to")?.toString();
          const amount = formData.get("amount")?.toString();

          if (to && amount) {
            transferTokens(to, amount);
          }
        }}
      >
        <div className="form-group">
          <label>Amount of {tokenSymbol}</label>
          <input
            className="form-control"
            type="number"
            step="1"
            name="amount"
            placeholder="1"
            required
          />
        </div>
        <div className="form-group">
          <label>Recipient address</label>
          <input className="form-control" type="text" name="to" required />
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Transfer" />
        </div>
      </form>
    </div>
  );
};
