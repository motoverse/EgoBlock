import * as functions from "firebase-functions";

interface MessageContent {
    address: string;
}

interface VerifyResult {
    ok: boolean;
    accessJWTToken?: string;
}

export const verify = async (message: MessageContent, signature: string): Promise<VerifyResult> => {
    functions.logger.info(`Verifying address: ${message.address} with signature: ${signature}`);
    const { SiweMessage } = require('siwe');
    try {
        const siweMessage = new SiweMessage(message)

        const fields = await siweMessage.validate(signature)

        // TODO validate nonce

        functions.logger.info('Fields from verify', fields);

        // TODO build JWT token
        const accessToken = '123'
        return {
            ok: true,
            accessJWTToken: accessToken
        }
    } catch (error) {
        functions.logger.info("Failed to verify message", error);
        return { ok: false }
    }

}