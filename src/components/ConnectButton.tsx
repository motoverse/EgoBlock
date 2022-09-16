import React, { useEffect, useState } from 'react'
import { SiweMessage } from 'siwe'
import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { walletAuthNonce, walletAuthVerify } from '../api/functions'
import { useApplication } from '../contexts/ApplicationContext'
import { parseQueryParam } from '../hooks/useQueryParams'

const appName = 'Ego Block'

export default function ConnectButton() {
    const { address, isConnected } = useAccount()
    const { connect } = useConnect({ connector: new InjectedConnector() })
    const { disconnect } = useDisconnect();
    const [loading, setLoading] = useState(false);
    const [nonce, setNonce] = useState('');
    const { redirectUrl } = parseQueryParam();
    const { application } = useApplication();
    const { chain: activeChain } = useNetwork()
    const { signMessageAsync } = useSignMessage()
    useEffect(() => {
        walletAuthNonce().then(setNonce)
    }, [])

    const verify = async () => {
        setLoading(true);
        const chainId = activeChain?.id
        const message = new SiweMessage({
            domain: window.location.host,
            address,
            statement: `Sign in with Ethereum to ${appName}.`,
            uri: window.location.origin,
            version: '1',
            chainId,
            nonce,
        });
        const signature = await signMessageAsync({
            message: message.prepareMessage(),
        })
        const token = await walletAuthVerify(message, signature, application.slug);

        const fullRedirectUrl = `${redirectUrl}?access_token=${token}`;
        window.location.href = fullRedirectUrl;
    }


    if (isConnected && address) {
        return <div className='d-flex flex-column card border-primary align-items-center p-3' style={{ maxWidth: '350px' }}>
            <h5 className='mb-5'>Connected Wallet: <span className='text-primary'>{address.substring(0, 4) + '...' + address.substring(address.length - 3)}</span></h5>
            <p className='mb-5 text-center'>To finish connecting, you must sign a message in your wallet to verify that you are the owner of this account.</p>
            <div className='d-flex justify-content-between w-100'>
                <button className='btn btn-outline-secondary me-2' onClick={() => disconnect()}>Sign Out</button>
                <button className='btn btn-secondary' onClick={verify} disabled={loading}>Verify</button>
            </div>
        </div >
    }

    return (
        <button className='btn btn-primary' onClick={() => connect()}>Connect Wallet</button>
    )
}
