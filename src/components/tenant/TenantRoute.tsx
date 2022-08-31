import React from 'react'
import { useAuth } from '../../contexts/AuthContext';
import TenantLoginPage from '../../pages/TenantLoginPage';

export default function TenantRoute(props: { children: any }): React.ReactElement | null {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) {
        return props.children;
    }
    return <TenantLoginPage />
}
