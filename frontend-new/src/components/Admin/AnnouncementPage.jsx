import React from 'react';

const AnnouncementPage = () => {
    return (
        <main className="space-y-8" aria-labelledby="announcements-title">
            <h1 id="announcements-title" className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Announcements
            </h1>
            <section className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6" aria-label="Announcements content">
                <p className="text-gray-300">No announcements yet.</p>
            </section>
        </main>
    );
};


export default AnnouncementPage;