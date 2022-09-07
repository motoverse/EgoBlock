import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { auth } from '../utils/firebase'
import { GithubAuthProvider, GoogleAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import firebaseui from 'firebaseui';
import { useAuth } from '../contexts/AuthContext';
import TenantHeader from '../components/tenant/TenantHeader';


export default function TenantLoginPage() {
    const { authenticate } = useAuth();
    const uiConfig: firebaseui.auth.Config = {
        signInFlow: 'popup',
        callbacks: {
            signInSuccessWithAuthResult: (authResult) => { authenticate(authResult); return false; },
        },
        signInOptions: [
            GoogleAuthProvider.PROVIDER_ID,
            TwitterAuthProvider.PROVIDER_ID,
            GithubAuthProvider.PROVIDER_ID,
        ],
    };
    return (
        <div>
            <TenantHeader />
            <div>TenantLogin</div>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </div>
    )
}
