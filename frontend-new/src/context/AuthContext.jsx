import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axios.js';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        role: null,
        loading: true
    });

    const navigate = useNavigate();

    useEffect(() => {
        // App load par LocalStorage se user info load karein
        const storedUser = localStorage.getItem('userInfo');

        if (storedUser) {
            const user = JSON.parse(storedUser);
            // Assuming the token is valid, set the state (Token validation backend par hoga)
            setAuth({
                user,
                role: user.role,
                loading: false
            });
        } else {
            setAuth({
                user: null,
                role: null,
                loading: false
            });
        }
    }, []);

    const loginUser = async (loginData) => {
        try {
            // ... (Payload creation logic) ...

            const payload = {};
            if (loginData.loginInput.includes('@')) {
                payload.email = loginData.loginInput;
            }
            else {
                payload.identifier = loginData.loginInput;
            }
            payload.password = loginData.password;

            const response = await axiosInstance.post('/auth/login', payload);

            const { user } = response.data;

            // User details LocalStorage mein save karein (Cookie khud manage ho jayegi)
            localStorage.setItem('userInfo', JSON.stringify(user));

            setAuth({
                user: null,
                role: null,
                loading: false
            });

            return {
                success: true,
                role: user.role
            };

        } catch (error) {
            // ... (Error handling logic) ...
            return {
                success: false,
                message: error.response?.data?.message || "Login failed"
            };
        }
    };

    const logoutUser = async () => {
        try {
            // Backend ko call karein taake woh HTTP-only cookie delete kare
            await axiosInstance.get('/auth/logout');
        } catch (err) {
            console.warn("Logout request failed (Server/Cookie issue)", err);
        } finally {
            localStorage.removeItem('userInfo'); // local state clear
            setAuth({
                user: null,
                role: null,
                loading: false
            });
            navigate('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ auth, loginUser, logoutUser }}>
            {!auth.loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);