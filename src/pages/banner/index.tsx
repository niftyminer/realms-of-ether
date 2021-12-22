import dynamic from "next/dynamic";
import { FC } from "react";
import { MoralisProvider } from "react-moralis";

const serverUrl = process.env.MORALIS_SERVER_URL ?? "";
const appId = process.env.MORALIS_APPLICATION_ID ?? "";

const Editor = dynamic(() => import("../../components/banner-editor/Editor"), {
  ssr: false,
});

const BannerEditor: FC = () => {
  return (
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
      <Editor />
    </MoralisProvider>
  );
};

export default BannerEditor;
