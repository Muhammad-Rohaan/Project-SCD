import UserModel from "../models/User.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import TeacherProfile from "../models/TeacherProfile.model.js";
import ReceptionProfileModel from "../models/ReceptionProfile.model.js";
import { sendEmail } from "../utils/email.js";


export const createAnnouncement = async (req, res) => {
    try {

        // when have Whatsapp API

        
        
    } catch (error) {
        res.status(500).json({
            msg: "Error in creating an announcement",
            err: error
        })
    }
}