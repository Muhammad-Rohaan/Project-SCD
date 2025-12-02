import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({

    stdId: {
        type: mongoose.Schema.Types.Number, /// It was ObjectId
        ref: 'User',
        required: true,
        unique: true
    },

    fatherName: {
        type: String,
        required: true,
        trim: true,
    },

    fatherPhone: {
        type: String,
        required: true,
        match: [/^[0-9]{11}$/, 'Valid 11-digit phone number'],
    },

    contact: String,
    address: String,
    age: Number,

    rollNo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    className: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
    },

    field: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// studentProfileSchema.index({ rollNo: 1 }); // Roll No ke basis pr fast searching ke liye
// studentProfileSchema.index({ className: 1 }); // Class wise filtering ke liye

export default mongoose.model('StudentProfile', studentProfileSchema);