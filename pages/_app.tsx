import "../styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chains, wagmiClient } from "../utils/walletSetup";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    domLoaded && (
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    )
  );
}

export default MyApp;
