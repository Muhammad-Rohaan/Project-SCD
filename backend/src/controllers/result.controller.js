import ResultImageModel from "../models/ResultImage.model.js";

// Teacher ya Admin result upload karsake (image URL Cloudinary sey ayegi)
export const uploadResultImage = async (req, res) => {
    try {
        const { className, testName, imageUrl } = req.body;

        if (!className || !testName || !imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'ClassName, TestName and imageUrl sab daalo bhai'
            });
        }

        const result = await ResultImageModel.create({
            className: className.toUpperCase(),
            testName,
            imageUrl,
            uploadedBy: req.user._id, // Who upload's
        });

        res.status(201).json({
            success: true,
            message: 'Result successfully uploaded',
            result,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Student apni class ka result dekh sake
export const getResultsByClass = async (req, res) => {
    try {
        const { className } = req.params;

        const results = await ResultImageModel.find({ className: className.toUpperCase() })
            .populate('uploadedBy', 'fullName')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: results.length,
            results,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Admin ya Teacher delete kar sakta hai
export const deleteResult = async (req, res) => {
    try {
        const result = await ResultImageModel.findById(req.params.id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Result nahi mila'
            })
        }

        // Sirf wuhi teacher delete kar sake jis nai upload kiya, ya admin
        if (
            result.uploadedBy.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: "You can't delete this result",
            });
        }

        await ResultImageModel.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Result delete ho gaya",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};