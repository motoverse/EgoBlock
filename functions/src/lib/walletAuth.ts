import * as functions from "firebase-functions";
import { generateToken } from "./auth";
import { getAppBySlug, recordAuthentication } from "./firestore";

interface MessageContent {
    address: string;
}

interface VerifyResult {
    ok: boolean;
    accessJWTToken?: string;
}

export const verify = async (message: MessageContent, signature: string, appSlug: string): Promise<VerifyResult> => {
    functions.logger.info(`Verifying address: ${message.address} with signature: ${signature}`);
    const { SiweMessage } = require('siwe');
    try {
        const siweMessage = new SiweMessage(message)

        const fields = await siweMessage.validate(signature)

        // TODO validate nonce

        const app = await getAppBySlug(appSlug);
        if (!app) {
            throw new Error(`App ${appSlug} not found`);
        }
        await recordAuthentication(message.address, app.id);

        functions.logger.info('Fields from verify', fields);
        const accessToken = await generateToken(message.address, appSlug);

        functions.logger.info('Generated Token');
        return {
            ok: true,
            accessJWTToken: accessToken
        }
    } catch (error) {
        functions.logger.info("Failed to verify message", error);
        return { ok: false }
    }

}