import { collection, doc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import Loading from '../components/Loading';
import TenantHeader from '../components/tenant/TenantHeader'
import { COLLECTION } from '../constants.ts/firebase';
import { Application } from '../models/Application';
import AppUser from '../models/AppUser';
import { db, fromFirebaseDoc, fromFirebaseDocs } from '../utils/firebase';
import { getWalletAuthURL } from '../utils/tenant';

export default function ApplicationPage() {
    const { applicationId } = useParams<{ applicationId: string }>();
    const [application, setApplication] = useState<Application>()
    const [appUsers, setAppUsers] = useState<AppUser[]>([]);

    useEffect(() => {
        if (applicationId) {
            const docRef = doc(db, `${COLLECTION.applications}/${applicationId}`);
            const unsubscribeApp = onSnapshot(docRef, (data) => {
                setApplication(fromFirebaseDoc(data));
            })

            const colRef = collection(db, `${COLLECTION.applications}/${applicationId}/${COLLECTION.users}`);
            const queryRef = query(colRef, orderBy('lastWalletAuth', 'desc'), limit(10))
            const unsubscribeUsers = onSnapshot(queryRef, (data) => {
                const newAppUsers = fromFirebaseDocs<AppUser>(data.docs);
                setAppUsers(newAppUsers);
            })

            return () => {
                unsubscribeApp();
                unsubscribeUsers();
            }
        }
    }, [applicationId]);

    return (
        <div>
            <TenantHeader />
            {application
                ? <div className='container'>
                    <h2>{application?.name}</h2>
                    <small>{getWalletAuthURL(application?.slug)}</small>

                    <h3 className='mt-4'>Users ({application.authWalletCount || 0})</h3>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Last Login Date</th>
                                <th scope="col">Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appUsers.map(appUser => <tr key={appUser.address}>
                                <td>{appUser.lastWalletAuth.toISOString()}</td>
                                <td>{appUser.address}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
                : <Loading />
            }
        </div>
    )
}
