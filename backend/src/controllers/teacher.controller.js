import TeacherProfileModel from "../models/TeacherProfile.model.js";
import StudentProfileModel from "../models/StudentProfile.model.js";
import cloudinary from "../utils/cloudinary.js";
import ResultImage from "../models/ResultImage.model.js";
import UserModel from "../models/User.model.js";
import fs from "fs/promises";




export const getStudentsByClass = async (req, res) => {
    try {

        const clsFilter = req.params.className;

        const stds = await StudentProfileModel.find({
            className: clsFilter
        })

        if (!stds) {
            res.status(404).json({
                msg: "Not Found any Student"
            });
        }

        res.status(200).json({
            msg: "Students",
            data: stds
        });

        
    } catch (error) {
        res.status(500).json({
            msg: "Error in searching",
            err: error
        });
    }
}



// ________________________________________

// Upload Result Image
export const uploadResultImage = async (req, res) => {
  let tempFilePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file zaroori hai" });
    }
    tempFilePath = req.file.path;

    const { className, testName } = req.body;
    const publicId = `${className.toUpperCase()}_${testName.replace(/ /g, '_')}_${Date.now()}`;

    if (!className || !testName) {
      return res.status(400).json({ message: "Class Name aur Test Name zaroori hai" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "results",
      public_id: publicId,
      overwrite: false, // Don't overwrite existing files with the same name
    });

    // Save to DB
    const newResult = await ResultImage.create({
      className: className.toUpperCase(),
      testName,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      uploadedBy: req.user._id
    });

    res.status(201).json({
      message: "Result uploaded successfully!",
      result: {
        className: newResult.className,
        testName: newResult.testName,
        imageUrl: newResult.imageUrl
      }
    });

  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "A result for this class and test name already exists." });
    }
    res.status(500).json({ message: "Upload failed due to an internal error." });
  } finally {
    if (tempFilePath) {
      await fs.unlink(tempFilePath); // Clean up the temporary file from the 'uploads' folder
    }
  }
};

// Get Results for Student's Class
export const getMyClassResults = async (req, res) => {
  try {
    // Student apni class ke results dekhega
    const student = await StudentProfileModel.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ message: "Student profile not found." });

    const results = await ResultImage.find({ className: student.className })

    console.log(results);
    

    res.json({
      className: student.className,
      totalResults: results.length,
      results: results.map(result => ({
        testName: result.testName,
        imageUrl: result.imageUrl
      }))

    });

  } catch (error) {
    console.error("Get My Class Results Error:", error);
    res.status(500).json({ message: "Error fetching results." });
  }
};

// Get All Results (Teacher/Admin)
export const getAllResults = async (req, res) => {
  try {
    const results = await ResultImage.find()
      .sort({ uploadedAt: -1 })
      .populate('uploadedBy', 'fullName');

    res.json({ total: results.length, results });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};
