import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { createAuthenticationAdapter, getDefaultWallets, RainbowKitAuthenticationProvider, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { SiweMessage } from 'siwe';
import { walletAuthNonce, walletAuthVerify } from '../api/functions';
import Header from '../components/Header';
import { parseQueryParam } from '../hooks/useQueryParams';
import { useApplication } from '../contexts/ApplicationContext';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const QUIK_NODE_RPC = "https://wispy-shy-smoke.avalanche-mainnet.discover.quiknode.pro/1f4cbbaec8cf19851402915fea59cf9b20a7cfbf/";

const avalancheChain: Chain = {
    id: 43_114,
    name: 'Avalanche',
    network: 'avalanche',
    nativeCurrency: {
        decimals: 18,
        name: 'Avalanche',
        symbol: 'AVAX',
    },
    rpcUrls: {
        default: QUIK_NODE_RPC,
    },
    blockExplorers: {
        default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
    },
    testnet: false,
}

export default function WalletLoginPage() {
    const { redirectUrl } = parseQueryParam();
    const { application } = useApplication();
    const appName = 'Ego Block'


    const { chains, provider, webSocketProvider } = configureChains(
        [avalancheChain],
        [
            jsonRpcProvider({
                rpc: (chain) => ({ http: chain.rpcUrls.default })
            })
        ],
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
            const token = await walletAuthVerify(message, signature, application.slug);

            const fullRedirectUrl = `${redirectUrl}?access_token=${token}`;
            window.location.href = fullRedirectUrl;
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
                    <Header />
                    <div className='center mt-5'>
                        <ConnectButton />
                    </div>
                </RainbowKitProvider>
            </RainbowKitAuthenticationProvider>
        </WagmiConfig>
    )
}
