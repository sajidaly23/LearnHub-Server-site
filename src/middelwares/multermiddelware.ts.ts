import multer from "multer";
import path from "path";

// Common storage function
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail") cb(null, "uploads/images");
    else if (file.fieldname === "document") cb(null, "uploads/documents");
    else if (file.fieldname === "video") cb(null, "uploads/videos");
    else if (file.fieldname === "image") cb(null, "uploads/userimages");
    else cb(new Error("Invalid file field"), "");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// For course files (multiple fields)
export const uploadCourseFiles = multer({ storage }).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "document", maxCount: 1 },
  { name: "video", maxCount: 1 }
]);

// For user profile image (single field)
export const uploadUserImage = multer({ storage }).single("image");
