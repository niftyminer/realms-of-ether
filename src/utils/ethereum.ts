export const getEthereumClient = (): any | undefined => {
  return (
    (typeof window !== "undefined" && (window as any).ethereum) || undefined
  );
};
