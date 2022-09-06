import config from "../utils/config";


const BASE_URL = config.useEmulators ? 'http://localhost:5001/egoblock-b17ad/europe-west1' : 'https://europe-west1-egoblock-b17ad.cloudfunctions.net';

export const walletAuthNonce = async (): Promise<string> => {
    const endpoint = `${BASE_URL}/walletAuthNonce`;

    const response = await fetch(endpoint);

    const json = await response.json();
    return json.nonce;
}

interface VerifyResult {
    ok: boolean;
    accessJWTToken?: string;
}

export const walletAuthVerify = async (message: any, signature: string, appSlug: string): Promise<string> => {
    const endpoint = `${BASE_URL}/walletAuthVerify`;

    const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ message, signature, appSlug })
    });

    const json: VerifyResult = await response.json();

    if (json.ok) {
        return json.accessJWTToken || '';
    } else {
        throw new Error('Invalid signature');
    }
}
