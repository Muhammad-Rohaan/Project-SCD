import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios.js';

const TeacherResultsPage = () => {
    const [uploadForm, setUploadForm] = useState({ className: '', testName: '', file: null });
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadResult, setUploadResult] = useState(null);

    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const fetchAll = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axiosInstance.get('/teacher/all-results');
            setResults(res.data.results || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load results');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleUploadChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'file') {
            setUploadForm(prev => ({ ...prev, file: files?.[0] || null }));
            return;
        }
        setUploadForm(prev => ({ ...prev, [name]: value }));
    };

    const submitUpload = async (e) => {
        e.preventDefault();
        setUploadLoading(true);
        setUploadError('');
        setUploadResult(null);

        try {
            const formData = new FormData();
            formData.append('className', uploadForm.className.trim().toUpperCase());
            formData.append('testName', uploadForm.testName.trim());
            formData.append('image', uploadForm.file);

            const res = await axiosInstance.post('/teacher/upload-result', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploadResult(res.data);
            setUploadForm({ className: '', testName: '', file: null });
            await fetchAll();
        } catch (err) {
            setUploadError(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploadLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Results
            </h1>

            <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Upload Result Image</h2>

                {uploadError && (
                    <div className="p-3 mb-4 text-sm text-red-300 bg-red-900/30 rounded-2xl border border-red-500/30">
                        {uploadError}
                    </div>
                )}

                <form onSubmit={submitUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        name="className"
                        value={uploadForm.className}
                        onChange={handleUploadChange}
                        className="input-style w-full"
                        placeholder="Class (e.g. 11)"
                        required
                    />
                    <input
                        name="testName"
                        value={uploadForm.testName}
                        onChange={handleUploadChange}
                        className="input-style w-full"
                        placeholder="Test Name"
                        required
                    />
                    <input
                        name="file"
                        type="file"
                        accept="image/*"
                        onChange={handleUploadChange}
                        className="input-style w-full"
                        required
                    />

                    <div className="md:col-span-3">
                        <button
                            type="submit"
                            disabled={uploadLoading || !uploadForm.file}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-bold hover:shadow-lg transition"
                        >
                            {uploadLoading ? 'Uploading…' : 'Upload'}
                        </button>
                    </div>
                </form>

                {uploadResult && (
                    <pre className="mt-5 text-sm text-gray-300 bg-black/30 p-4 rounded-2xl overflow-x-auto border border-cyan-400/10">
                        {JSON.stringify(uploadResult, null, 2)}
                    </pre>
                )}
            </div>

            <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-cyan-300">All Results</h2>
                    <button
                        onClick={fetchAll}
                        className="py-3 px-6 rounded-2xl bg-indigo-800/60 hover:bg-indigo-800 text-white font-bold transition"
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <p className="text-white text-xl animate-pulse mt-4">Loading results…</p>
                ) : error ? (
                    <p className="text-red-300 mt-4">{error}</p>
                ) : results.length === 0 ? (
                    <p className="text-gray-300 mt-4">No results uploaded yet.</p>
                ) : (
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full text-left border border-cyan-400/30 rounded-2xl overflow-hidden">
                            <thead className="bg-indigo-900/50">
                                <tr>
                                    <th className="p-4 text-cyan-300">Class</th>
                                    <th className="p-4 text-cyan-300">Test</th>
                                    <th className="p-4 text-cyan-300">Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map(r => (
                                    <tr key={r._id} className="border-t border-cyan-400/20">
                                        <td className="p-4 text-white">{r.className}</td>
                                        <td className="p-4 text-gray-200">{r.testName}</td>
                                        <td className="p-4">
                                            <a
                                                href={r.imageUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-cyan-300 hover:text-cyan-200 underline"
                                            >
                                                Open
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherResultsPage;
