import mongoose from 'mongoose';

const resultImageSchema = new mongoose.Schema({

    className: {
        type: String,
        required: [true, 'Class name is required'],
        trim: true,
    },
    testName: {
        type: String,
        required: [true, 'Test name is required'],
        trim: true
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required']
    }, // Cloudinary URL 
    uploadedBy: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Ek test ka result sirf ek baar
resultImageSchema.index({ className: 1, testName: 1 }, { unique: true });
resultImageSchema.index({ className: 1 }); // Class-wise searching ke liye
resultImageSchema.index({ uploadedBy: 1 }); // Teacher-wise results

export default mongoose.model('ResultImage', resultImageSchema);