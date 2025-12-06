import TeacherProfile from '../models/TeacherProfile.model.js';

export const restrictToOwnClass = async (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'receptionist') return next();

    if (req.user.role === 'teacher') {
        const teacher = await TeacherProfile.findOne({ userId: req.user._id });
        if (!teacher) return res.status(403).json({ message: 'Teacher profile not found' });

        const requestedClass = (req.params.className || req.body.className)?.toUpperCase();
        if (teacher.className?.toUpperCase() !== requestedClass) {
            return res.status(403).json({ message: 'You can only access your own class' });
        }
    }
    next();
};