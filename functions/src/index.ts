import * as functions from "firebase-functions";
import { REGION } from "./lib/constants";
import { verify } from "./lib/walletAuth";
import { apiWrapper } from "./lib/api";
// import * as admin from 'firebase-admin';
import { getUserInfo } from "./lib/users";
import { verifyToken } from "./lib/auth";

// admin.initializeApp();

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

        const { message, signature, appSlug } = typeof request.body === 'object' ? request.body : JSON.parse(request.body);
        const result = await verify(message, signature, appSlug);

        response.json(result);
    });
});

//----------- USER APIs

export const getUser = functions.region(REGION).https.onRequest(async (request, response) => {
    return apiWrapper(request, response, async () => {
        const userInfo = await verifyToken(request);

        const result = await getUserInfo(userInfo.uid);

        response.json(result);
    });
});