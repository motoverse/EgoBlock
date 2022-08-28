import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public'
import { createAuthenticationAdapter, getDefaultWallets, RainbowKitAuthenticationProvider, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { SiweMessage } from 'siwe';
import { walletAuthNonce, walletAuthVerify } from '../api/functions';

export default function WalletLoginPage() {
    const appName = 'Ego Block'


    const { chains, provider, webSocketProvider } = configureChains(
        [chain.mainnet, chain.polygon],
        [publicProvider()],
    )

    const { connectors } = getDefaultWallets({
        appName,
        chains
    });

    const authenticationAdapter = createAuthenticationAdapter({
        getNonce: async () => {
            const nonce = await walletAuthNonce();
            return nonce;
        },

        createMessage: ({ nonce, address, chainId }) => {
            return new SiweMessage({
                domain: window.location.host,
                address,
                statement: `Sign in with Ethereum to ${appName}`,
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
            const token = await walletAuthVerify(message, signature);
            console.log('got token', token);
            return true;
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

    return (
        <WagmiConfig client={client}>
            <RainbowKitAuthenticationProvider
                adapter={authenticationAdapter}
                status={'unauthenticated'}
            >
                <RainbowKitProvider coolMode chains={chains} >
                    <ConnectButton />
                </RainbowKitProvider>
            </RainbowKitAuthenticationProvider>
        </WagmiConfig>
    )
}
