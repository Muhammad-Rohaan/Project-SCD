import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ loginInput: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await loginUser(formData);
            console.log("Login Result:", result);

            if (result.success) {
                const role = result.user.role;
                switch (role) {
                    case 'admin':
                        navigate('/admin/dashboard');
                        break;
                    case 'receptionist':
                        navigate('/reception/dashboard');
                        break;
                    case 'teacher':
                        navigate('/teacher/dashboard');
                        break;
                    case 'student':
                        navigate('/student/dashboard');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                setError(result.message || "Login failed");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br 
         from-slate-900 via-indigo-950 to-slate-900 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="w-full max-w-md p-10 space-y-8 bg-white/5 backdrop-blur-xl rounded-3xl 
                shadow-2xl border border-cyan-400/20 hover:border-cyan-400/40 transition-all 
                duration-500"
            >
                <div className="text-center">
                    <motion.h1
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="text-4xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 
                        bg-clip-text text-transparent"
                    >
                        AZ Coaching
                    </motion.h1>
                    <p className="mt-3 text-sm text-gray-300">Sign in to access admin dashboard</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 text-sm text-red-300 bg-red-900/30 rounded-2xl border 
                        border-red-500/40 backdrop-blur-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="loginInput" className="block text-sm font-medium text-gray-200">
                                Email or ID
                            </label>
                            <input
                                autoFocus
                                id="loginInput"
                                name="loginInput"
                                type="text"
                                required
                                className="mt-2 block w-full px-5 py-4 bg-white/10 text-white placeholder-gray-400 
                                border border-cyan-400/30 rounded-2xl focus:ring-4 focus:ring-cyan-400/50 
                                focus:border-cyan-400 outline-none backdrop-blur-md transition-all"
                                placeholder="admin@example.com"
                                value={formData.loginInput}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-2 block w-full px-5 py-4 bg-white/10 text-white placeholder-gray-400 
                                border border-cyan-400/30 rounded-2xl focus:ring-4 focus:ring-cyan-400/50 
                                focus:border-cyan-400 outline-none backdrop-blur-md transition-all"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-6 text-lg font-semibold rounded-2xl text-white 
                        bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 
                        shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
                    >
                        {loading ? 'Signing in…' : 'Sign In'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
