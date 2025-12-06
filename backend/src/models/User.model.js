import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        // unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter valid email address'],
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },

    role: {
        type: String,
        enum: ['admin', 'receptionist', 'teacher', 'student'],
        required: [true, 'Role is required'],
        lowercase: true,
    },

    isActive: {  // still in Coa
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

// userSchema.index({ email: 1 }); // Email ke basis par fast searching ke liye
// userSchema.index({ role: 1 }); // Role-wise filtering ke liye

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);