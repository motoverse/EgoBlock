import * as functions from "firebase-functions";

interface MessageContent {
    address: string;
}

interface VerifyResult {
    ok: boolean;
    accessToken?: string;
}

export const verify = async (message: MessageContent, signature: string): Promise<VerifyResult> => {
    functions.logger.info(`Verifying address: ${message.address} with signature: ${signature}`);
    return {
        ok: false,
    }
}