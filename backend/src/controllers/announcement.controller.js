export const createAnnouncement = async (req, res) => res.json({
    message: 'Announcement created'
});
export const getAnnouncements = async (req, res) => res.json({
    message: 'All announcements'
});
export const deleteAnnouncement = async (req, res) => res.json({
    message: 'Deleted'
});