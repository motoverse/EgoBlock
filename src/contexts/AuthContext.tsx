import React, { useContext } from 'react'
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

export default function AuthProvider({ children }: any) {
    const [user, setUser] = React.useState<User>({ userId: '', displayName: '' });
    const authenticate = async (authResult: any) => {
        if (authResult?.user) {
            setUser({
                userId: authResult.user.uid,
                displayName: authResult.user.displayName,
            });
        }
    }

    const logout = async () => {
        await auth.signOut();
        setUser({ userId: '', displayName: '' });
    }

    return <authContext.Provider value={{
        user,
        isAuthenticated: !!user.userId,
        logout,
        authenticate
    }}>
        {children}
    </authContext.Provider>
}