import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({

    studentId: { type: String, required: true },
    studentName: String,
    className: String,
    date: { type: Date, required: true },
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'leave'],
    },
    markedBy: String
}, { timestamps: true });

attendanceSchema.index({studentId: 1, date: 1}, {unique: true});
export default mongoose.model('Attendance', attendanceSchema);