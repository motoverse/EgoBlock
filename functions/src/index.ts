import * as functions from "firebase-functions";
import { REGION } from "./lib/constants";
import { verify } from "./lib/walletAuth";
import { apiWrapper } from "./lib/api";

export const walletAuthVerify = functions.region(REGION).https.onRequest(async (request, response) => {
    return apiWrapper(request, response, async () => {
        const { message, signature } = request.body;
        const result = await verify(message, signature);

        response.json(result);
    });
});