import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";
import { Inspector } from "./inspect/Inspector";

const IndexPage = () => {
  const router = useRouter();
  const x = router.query["x"];
  const y = router.query["y"];
  useEffect(() => {
    if (x && y) {
      router.push(`/inspect/${x}:${y}/`);
    }
  }, [x, y]);

  return <Inspector />;
};

export default IndexPage;
