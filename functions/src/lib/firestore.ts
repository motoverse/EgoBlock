import * as admin from 'firebase-admin';
import Application from '../models/application';

export enum COLLECTION {
    applications = "applications",
    users = "users",
}



export const getAppBySlug = async (slug: string): Promise<Application | null> => {
    const candidates = await admin.firestore().collection(COLLECTION.applications).where("slug", "==", slug).get();

    const data = fromFirebaseDocs<Application>(candidates.docs);

    if (data?.length) {
        return data[0];
    }
    return null;
}



export const recordAuthentication = async (address: string, appId: string) => {
    await admin.firestore().doc(`${COLLECTION.applications}/${appId}/${COLLECTION.users}/${address}`).set({
        lastWalletAuth: new Date(),
        address
    }, { merge: true })
}
export const incrementAuthWalletCount = async (appId: string) => {
    const appDocRef = admin.firestore().doc(`${COLLECTION.applications}/${appId}`);
    await appDocRef.set({
        authWalletCount: admin.firestore.FieldValue.increment(1)
    }, { merge: true });
}


function fromFirebaseDoc<Type>(doc: any): Type {
    const data = doc.data();

    const convertedData: any = {
        id: doc.id,
    };
    for (const key of Object.keys(data)) {
        let value = data[key];
        if (typeof value === 'object' && value?.toDate) {
            value = value.toDate();
        }
        convertedData[key] = value;
    }

    return convertedData;
}

function fromFirebaseDocs<Type>(docs: Array<any>): Array<Type> {
    return docs.map(doc => fromFirebaseDoc<Type>(doc));
}

