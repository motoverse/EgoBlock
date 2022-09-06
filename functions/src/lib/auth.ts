import * as functions from "firebase-functions";
import { JWT_SECRET } from "./constants";

export const generateToken = async (address: string, appSlug: string) => {
    const jwt = require('jsonwebtoken');
    const data = {
        uid: address,
        aud: appSlug
    };
    const token = await jwt.sign(data, JWT_SECRET, { expiresIn: '1h' });
    return token;
}

interface TokenData {
    uid: string;
    aud: string;
}
export const verifyToken = async (request: functions.https.Request): Promise<TokenData> => {
    const token = request.headers.authorization?.split('Bearer ')[1];

    const jwt = require('jsonwebtoken');

    return await jwt.verify(token, JWT_SECRET);
}
