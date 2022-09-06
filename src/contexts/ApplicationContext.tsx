import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import Loading from '../components/Loading';
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
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const q = query(collection(db, COLLECTION.applications), where("slug", "==", applicationSlug));
        const snapshot = onSnapshot(q, data => {
            if (data.docs.length > 0) {
                setApplication(fromFirebaseDoc(data.docs[0]));
            }
        })
        const timeout = setTimeout(() => setLoading(false), 1000);
        return () => {
            clearTimeout(timeout);
            snapshot();
        }
    }, [applicationSlug])


    if (!application.slug) {
        if (loading) {
            return <div className="center flex-1"><Loading /></div>
        } else {
            return <div className="center flex-1">Application not found</div>
        }
    }


    return <applicationContext.Provider value={{
        application,
    }}>
        {children}
    </applicationContext.Provider>
}