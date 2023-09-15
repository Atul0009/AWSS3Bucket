import fs from "fs";
import path from "path";
import multer from "multer";

var imageUpload;

var upload = ()=>{
    return imageUpload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                const folderName = req.query.folderName;
                const path = `rootFolder/${folderName}/`;
                fs.mkdirSync(path, {recursive: true})
                cb(null, path)
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + path.extname(file.originalname))
            }
        }),
        limits: {fileSize: 10000000},
        fileFilter: function (req, file, cb) {
            cb(null, true);
        }
    })
}

export default upload;