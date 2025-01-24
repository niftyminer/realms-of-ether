import { CSSProperties, FC, ReactNode } from "react";

export const Row: FC<{ style?: CSSProperties; children?: ReactNode }> = ({
  children,
  style,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexFlow: "row wrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
