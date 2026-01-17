import { createContext, useEffect, useState} from "react";
import { getMe } from "../api/auth.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        getMe(token)
            .then((data) => {
                setUser(data);
            })
            .catch((error) => {
                console.error("Failed to fetch user data:", error);
                setUser(null);
            }) 
            .finally(() => {
                setLoading(false);
            }
        );
    }, []);
    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
