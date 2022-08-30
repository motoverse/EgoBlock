import React from 'react'
import TenantLoginPage from '../pages/TenantLoginPage';

export default function TenantRoute(props: { children: any }): React.ReactElement | null {
    const isLoggedIn = false;
    if (isLoggedIn) {
        return props.children;
    }
    return <TenantLoginPage />
}
