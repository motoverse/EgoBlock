import * as functions from "firebase-functions";
import * as corsBuilder from 'cors';

export const apiWrapper = async (request: functions.https.Request, response: functions.Response<any>, handler: (request: functions.https.Request, response: functions.Response<any>) => Promise<void>) => {
    const cors = corsBuilder({ origin: true });
    return cors(request, response, async () => {
        try {
            return handler(request, response);
        } catch (error) {
            functions.logger.error('Error:', error);
            response.status(500).send(error);
        }
    });
}