import { FC } from "react";

export const Row: FC = ({ children }) => {
  return (
    <div
      style={{ display: "flex", alignItems: "center", flexFlow: "row wrap" }}
    >
      {children}
    </div>
  );
};
