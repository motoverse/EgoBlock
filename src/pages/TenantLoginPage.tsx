import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { auth } from '../utils/firebase'
import logoSrc from '../assets/egoblock_black.svg'
import logoImageSrc from '../assets/logo.svg'
import { GithubAuthProvider, GoogleAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import firebaseui from 'firebaseui';
import { useAuth } from '../contexts/AuthContext';


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
        <div className="container m-auto">
            <div className="row gx-5 align-items-center justify-content-center">
                <div className="col-lg-5 order-lg-2">
                    <div className="shadow p-5 bg-body rounded text-center">
                        <h3>Sign up</h3>
                        <p className="mb-5">Sign in to experience web3 as it is meant to be</p>
                        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
                    </div>
                </div>
                <div className="col-lg-5 order-lg-1">
                    <div className="">
                        <img src={logoImageSrc} alt="egoBlock" className="me-2" style={{ width: '70px' }} />
                        <img src={logoSrc} alt="egoBlock" style={{ width: '250px' }} />
                        <h2 className="h2_login">Start building <br />something awesome today!</h2>
                    </div>
                </div>

            </div>
        </div>
    )
}
