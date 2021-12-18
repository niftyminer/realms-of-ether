import { FC } from "react";
import { MoralisProvider } from "react-moralis";
import Editor from "./Editor";

const serverUrl = process.env.MORALIS_SERVER_URL ?? "";
const appId = process.env.MORALIS_APPLICATION_ID ?? "";

const BannerEditor: FC = () => {
  return (
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
      <Editor />
    </MoralisProvider>
  );
};

export default BannerEditor;
