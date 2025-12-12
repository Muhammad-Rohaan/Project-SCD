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

        const result = await loginUser(formData);

        if (result.success) {
            switch (result.role) {
                case 'admin':
                    navigate('/admin/dashboard');
                    break;
                case 'reception':
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
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-slate-800 to-slate-900 p-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full max-w-md p-10 space-y-8 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20"
            >
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-white tracking-wide">Institute ERP</h1>
                    <p className="mt-2 text-sm text-slate-200">Sign in to continue</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 text-sm text-red-200 bg-red-500/20 rounded border border-red-400/40"
                    >
                        {error}
                    </motion.div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="loginInput" className="block text-sm font-medium text-white">
                                Email
                            </label>
                            <input
                                id="loginInput"
                                name="loginInput"
                                type="text"
                                required
                                className="mt-1 block w-full px-4 py-3 bg-white/20 text-white placeholder-slate-300 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none backdrop-blur-md"
                                placeholder="admin@example.com"
                                value={formData.loginInput}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 block w-full px-4 py-3 bg-white/20 text-white placeholder-slate-300 border border-white/30 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none backdrop-blur-md"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 
                        transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 tracking wide"
                    >
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
