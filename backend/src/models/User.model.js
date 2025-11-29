import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    fullName: { type: String, required: true, trim: true },
    fatherName: { type: String, trim: true },
    age: { type: Number, min: 12, max: 100 },
    gender: { type: String, enum: ['Male', 'Female'] },
    contact: { type: String, match: /^[0-9]{11}$/ },
    fatherPhone: { type: String, required: true, match: /^[0-9]{11}$/ },
    address: String,
    email: { type: String, unique: true, sparse: true, lowercase: true },
    password: { type: String, required: true, select: false },

    // Student fields
    className: String,
    fields: String,
    rollNo: { type: String, unique: true, sparse: true, index: true },

    // Teacher fields
    qualification: String,
    salary: Number,
    cnic: { type: String, unique: true, sparse: true },

    role: {
        type: String,
        enum: ['admin', 'receptionist', 'teacher', 'student'],
        required: true,
        lowercase: true
    },

    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);