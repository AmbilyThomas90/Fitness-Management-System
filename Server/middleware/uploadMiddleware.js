
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};
const upload = multer({ storage });

export default upload;

//**  Note: Both Code working * */

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const uploadDir = "uploads";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// const storage = multer.diskStorage({
//   destination: uploadDir,
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   file.mimetype.startsWith("image/")
//     ? cb(null, true)
//     : cb(new Error("Only image files allowed"), false);
// };

// // const upload = multer({
// //   storage,
// //   limits: { fileSize: 5 * 1024 * 1024 },
// //   fileFilter,
// // });
//  const upload = multer({ storage });

// export default upload;

