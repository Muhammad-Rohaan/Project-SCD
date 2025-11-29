import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({

    studentId: { type: String, required: true },
    studentName: String,
    className: String,
    month: { type: String, required: true },
    amount: { type: Number, required: true },
    paid_Amount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['paid', 'unpaid', 'pending'],
        default: 'pending'
    },
    collectedBy: String
}, { timestamps: true });

export default mongoose.model('Fee', feeSchema);