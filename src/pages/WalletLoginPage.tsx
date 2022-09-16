import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import Header from '../components/Header';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import ConnectButton from '../components/ConnectButton';

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


    const { chains, provider, webSocketProvider } = configureChains(
        [avalancheChain],
        [
            jsonRpcProvider({
                rpc: (chain) => ({ http: chain.rpcUrls.default })
            })
        ],
    )

    const connectors = [
        new MetaMaskConnector({ chains }),
    ]

    const client = createClient({
        autoConnect: false,
        provider,
        webSocketProvider,
        connectors,
    })

    return (
        <WagmiConfig client={client}>
            <Header />
            <div className='center mt-5'>
                <ConnectButton />
            </div>
        </WagmiConfig>
    )
}
