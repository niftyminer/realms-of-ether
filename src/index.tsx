import { Container, Icon } from "nes-react";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App";
import { Donation } from "./components/Donation";

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <App />
      <Donation />
      <div
        style={{
          display: "flex",
          flex: 1,
          flexShrink: 0,
          paddingTop: 20,
          paddingBottom: 20,
          alignItems: "center",
          maxWidth: 1024,
        }}
      >
        <Container title="Credits" rounded>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3>nifty_miner</h3>
            <div style={{ paddingLeft: 10, paddingRight: 10 }}>
              <a
                href="https://twitter.com/nifty_miner"
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
  </React.StrictMode>,
  document.getElementById("root")
);
