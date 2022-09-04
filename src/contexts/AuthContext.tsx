import React, { useContext, useEffect } from 'react'
import User from '../models/User';
import { auth } from '../utils/firebase';


interface AuthContext {
    user: User
    isAuthenticated: boolean
    authenticate: (authResult: any) => void
    logout: () => Promise<void>
}

const authContext = React.createContext<AuthContext>({
    isAuthenticated: false,
} as any);

export function useAuth() {
    return useContext(authContext)
}

const parseUser = (user: any): User => {
    return {
        uid: user.uid,
        displayName: user.displayName,
    }
}

export default function AuthProvider({ children }: any) {
    const [user, setUser] = React.useState<User>({ uid: '', displayName: '' });
    useEffect(() => {
        return auth.onAuthStateChanged(data => {
            setUser(parseUser(data));
        });
    }, [])

    const authenticate = async (authResult: any) => {
        if (authResult?.user) {
            setUser(parseUser(authResult.user));
        }
    }

    const logout = async () => {
        await auth.signOut();
        setUser({ uid: '', displayName: '' });
    }

    return <authContext.Provider value={{
        user,
        isAuthenticated: !!user.uid,
        logout,
        authenticate
    }}>
        {children}
    </authContext.Provider>
}