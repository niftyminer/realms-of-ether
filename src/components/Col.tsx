import { FC } from "react";

export const Col: FC<{ size?: number }> = ({ children, size = 1 }) => {
  return <div style={{ flex: size }}>{children}</div>;
};
