import React from 'react'
import { useAuth } from '../../contexts/AuthContext';

export default function TenantHeader() {
    const { user, logout } = useAuth();

    return (
        <header className="p-2 bold text-primary bg-dark">
            <div className='d-flex align-items-center'>
                <div className='flex-grow-1'>EgoBlock</div>
                <div>{user.displayName}</div>
                <button className='btn btn-secondary ms-2' onClick={logout}>Logout</button>
            </div>
        </header>
    )
}
