import UserModel from "../models/User.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import TeacherProfile from "../models/TeacherProfile.model.js";
import ReceptionProfileModel from "../models/ReceptionProfile.model.js";
import { sendEmail } from "../utils/email.js";
import AnnouncementModel from "../models/Announcement.model.js";


export const createAnnouncement = async (req, res) => {
    try {

        const { title, message, target, className, createdBy } = req.body;

        if (!title || !message || !target || !className || !createdBy) {
            return res.json({
                msg: "All fields should be entered"
            });
        }

        let newAnnouncement = new AnnouncementModel(
            {
                title: title,
                message: message,
                target: target,
                className: className,
                createdBy: createdBy
            }
        );

        await newAnnouncement.save();

        res.status(200).json({
            message: "Announcement created successfully",
            newAnnouncement
        });


    } catch (error) {
        res.status(500).json({
            msg: "Error in creating an announcement",
            err: error
        })
    }
}

export const getAnnouncements = async (req, res) => {
    try {

        const announcement = await AnnouncementModel.find({});

        res.json({
            announcement
        });
        
    } catch (error) {
        
    }
}

export const deleteAnnouncement = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}