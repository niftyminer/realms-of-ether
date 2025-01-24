import { FC, useState, PropsWithChildren } from "react";
import {
  ConnectButton,
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import Link from "next/link";
import { Container, Icon } from "nes-react";
import { Donation } from "./Donation";
import { http, WagmiProvider } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient()

export const config = getDefaultConfig({
  chains: [mainnet, sepolia],
  projectId: "f2bc54e835c2202d7936205153d7a85f",
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  appName: "Realms of Ether Revive",
})

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
          <div
            style={{
              width: "100vw",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 600,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Link href="/inspect">
                  <a style={{ textDecoration: "none", color: "black" }}>
                    <h3>Inspector</h3>
                  </a>
                </Link>
                <Link href="/goldmine">
                  <a style={{ textDecoration: "none", color: "black" }}>
                    <h3>Gold Mine</h3>
                  </a>
                </Link>
                <Link href="/learn">
                  <a style={{ textDecoration: "none", color: "black" }}>
                    <h3>Learn</h3>
                  </a>
                </Link>

                <a
                  href="https://mango-puck-2f0.notion.site/Realms-DAO-4db97df04c8f4cf8a5e163abff56e266"
                  style={{ textDecoration: "none", color: "black" }}
                  target="_blank"
                >
                  <h3>DAO</h3>
                </a>
              </div>
              <ConnectButton />
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: 15,
              }}
            >
              <Link href="/">
                <a style={{ textDecoration: "none", color: "black" }}>
                  <h1>Realms Of Ether Revive</h1>
                </a>
              </Link>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "1 0 auto",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: 15,
                maxWidth: "95%",
                alignItems: "center",
              }}
            >
              {children}
            </div>
            <Donation />
            <div
              style={{
                display: "flex",
                flex: 1,
                flexShrink: 0,
                paddingTop: 20,
                paddingBottom: 20,
                alignItems: "center",
                maxWidth: 1200,
              }}
            >
              <Container title="Credits" rounded>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h3>vmark</h3>
                  <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                    <a
                      href="https://twitter.com/vmaark_"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon icon={"twitter"} />
                    </a>
                  </div>
                  <div style={{ paddingLeft: 5, paddingRight: 10 }}>
                    <h3>
                      Check out{" "}
                      <a
                        href="https://opensea.io/collection/realms-of-ether-1"
                        target="_blank"
                        rel="noreferrer"
                      >
                        OpenSea
                      </a>{" "}
                      for fortresses
                    </h3>
                  </div>
                </div>
              </Container>
            </div>
          </div>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};
