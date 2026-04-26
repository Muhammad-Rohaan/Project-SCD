import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BellIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../../api/axios.js';

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

const AnnouncementBell = () => {
    const [open, setOpen] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unread, setUnread] = useState(0);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
    const bellRef = useRef(null);

    /* ── Fetch on mount ── */
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get('/announcement');
                const data = res.data.announcement || [];
                setAnnouncements(data);
                setUnread(data.length);
            } catch (err) {
                console.error('Bell fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    /* ── Close on outside click ── */
    useEffect(() => {
        const handler = (e) => {
            if (bellRef.current && !bellRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleOpen = () => {
        if (!open && bellRef.current) {
            const rect = bellRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
            });
        }
        setOpen(prev => !prev);
        setUnread(0);
    };

    const dropdown = (
        <div
            style={{
                position: 'fixed',
                top: dropdownPos.top,
                right: dropdownPos.right,
                zIndex: 99999,
            }}
            className="w-80 sm:w-96 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 shadow-2xl shadow-cyan-500/10 overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <h3 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    📢 Announcements
                </h3>
                <span className="text-xs text-gray-500">{announcements.length} total</span>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                {loading ? (
                    <div className="p-4 space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse space-y-1">
                                <div className="h-3 w-2/3 rounded bg-white/10" />
                                <div className="h-2 w-full rounded bg-white/10" />
                            </div>
                        ))}
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                        <div className="text-3xl mb-2">📭</div>
                        No announcements yet
                    </div>
                ) : (
                    announcements.map((ann) => (
                        <div key={ann._id} className="px-4 py-3 hover:bg-white/5 transition">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-white leading-snug">
                                    {ann.title}
                                </p>
                                <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                    ann.target === 'all'
                                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'
                                        : 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                                }`}>
                                    {ann.target === 'all' ? 'All' : ann.className}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{ann.message}</p>
                            <p className="text-[10px] text-gray-600 mt-1.5">
                                {ann.createdBy} · {formatDate(ann.createdAt)}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            {announcements.length > 0 && (
                <div className="px-4 py-2 border-t border-white/10 text-center">
                    <p className="text-xs text-gray-500">Scroll to see all announcements</p>
                </div>
            )}
        </div>
    );

    return (
        <div ref={bellRef} className="relative">
            {/* Bell Button */}
            <button
                onClick={handleOpen}
                className="relative p-2 text-cyan-400 hover:text-purple-400 hover:bg-indigo-800/50 rounded-full transition"
                aria-label="View announcements"
            >
                <BellIcon className="w-6 h-6" aria-hidden="true" />
                {unread > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center">
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>

            {/* Dropdown via Portal — escapes header overflow */}
            {open && createPortal(dropdown, document.body)}
        </div>
    );
};

export default AnnouncementBell;