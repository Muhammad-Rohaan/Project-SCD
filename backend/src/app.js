import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import feeRoutes from './routes/fee.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import resultRoutes from './routes/result.routes.js';
import teacherRoutes from './routes/teacher.routes.js';


dotenv.config();
const app = express();

// Connect Database
connectDB();

app.use(cors());
app.use(express.json());

app.use('/test', (req, res) => {
    res.send("Route working!");
});
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/teacher', teacherRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'IMS Backend Live - Rohan & Hadi MERN Project 2025' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server chal raha hai port ${PORT}`);
});