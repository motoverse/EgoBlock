import React from 'react';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public'
import './App.scss';
import WalletLoginPage from './pages/WalletLoginPage';
import { createAuthenticationAdapter, getDefaultWallets, RainbowKitAuthenticationProvider, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { SiweMessage } from 'siwe';

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.polygon],
  [publicProvider()],
)

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    // TODO nonce
    // const response = await fetch('/api/nonce');
    return '21'
  },

  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      domain: window.location.host,
      address,
      // TODO name
      statement: 'Sign in with Ethereum to the app.',
      uri: window.location.origin,
      version: '1',
      chainId,
      nonce,
    });
  },

  getMessageBody: ({ message }) => {
    return message.prepareMessage();
  },

  verify: async ({ message, signature }) => {
    // TODO verify

    console.log('Veryfying', message, signature)

    return true;
    const verifyRes = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, signature }),
    });

    return Boolean(verifyRes.ok);
  },

  signOut: async () => {
    // TODO logout
    await fetch('/api/logout');
  },
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
      <RainbowKitAuthenticationProvider
        adapter={authenticationAdapter}
        status={'unauthenticated'}
      >
        <RainbowKitProvider coolMode chains={chains} >
          <div >
            <header className="m-2">
              EgoBlock
            </header>
            <WalletLoginPage />
          </div>
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}

export default App;
