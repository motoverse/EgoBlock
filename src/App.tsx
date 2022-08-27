import React from 'react';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public'
import './App.scss';
import WalletLoginPage from './pages/WalletLoginPage';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.polygon],
  [publicProvider()],
)

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors,

})

function App() {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider coolMode chains={chains}>
        <div >
          <header className="m-2">
            EgoBlock
          </header>
          <WalletLoginPage />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
