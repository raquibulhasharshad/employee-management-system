import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "employee_images",         // folder name
    format: file.mimetype.split("/")[1] as "jpg" | "jpeg" | "png" | "gif",
    public_id: `${file.fieldname}-${Date.now()}`,
    transformation: [{ width: 400, height: 400, crop: "limit" }],
  }),
});

const uploads = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max
export default uploads;
