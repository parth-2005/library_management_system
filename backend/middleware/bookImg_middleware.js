import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js'

const storage = new CloudinaryStorage({
    cloudinary,
        params: {
        folder: "book_img",
        format: "png",
        public_id: (req, file) =>
            file.fieldname + "-" + Date.now(),
  },
})

const upload = multer({
    storage,
    limits:{fileSize: 10*1024*1024},
});

export default upload;