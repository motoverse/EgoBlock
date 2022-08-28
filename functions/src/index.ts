import * as functions from "firebase-functions";
import { REGION } from "./lib/constants";
import { verify } from "./lib/walletAuth";
import { apiWrapper } from "./lib/api";

export const walletAuthNonce = functions.region(REGION).https.onRequest(async (request, response) => {
    return apiWrapper(request, response, async () => {
        const { generateNonce } = require('siwe');
        const nonce = generateNonce();
        functions.logger.info(`Generated nonce: ${nonce}`);

        // TODO store nonce in database to validate later

        response.json({ nonce });
    });
});

export const walletAuthVerify = functions.region(REGION).https.onRequest(async (request, response) => {
    return apiWrapper(request, response, async () => {
        const { message, signature } = JSON.parse(request.body);
        const result = await verify(message, signature);

        response.json(result);
    });
});