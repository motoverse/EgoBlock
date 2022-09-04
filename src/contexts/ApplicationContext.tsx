import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router';
import { COLLECTION } from '../constants.ts/firebase';
import { Application } from '../models/Application';
import { db, fromFirebaseDoc } from '../utils/firebase';


interface ApplicationContext {
    application: Application
}

const applicationContext = React.createContext<ApplicationContext>({
    application: null,
} as any);

export function useApplication() {
    return useContext(applicationContext)
}

export default function ApplicationProvider({ children }: any) {
    const { applicationSlug } = useParams<{ applicationSlug: string }>();
    const [application, setApplication] = React.useState<Application>({ slug: '', name: '', owner: '' });
    useEffect(() => {
        const q = query(collection(db, COLLECTION.applications), where("slug", "==", applicationSlug));
        return onSnapshot(q, data => {
            if (data.docs.length > 0) {
                setApplication(fromFirebaseDoc(data.docs[0]));
            }
        })
    }, [applicationSlug])


    return <applicationContext.Provider value={{
        application,
    }}>
        {children}
    </applicationContext.Provider>
}