import multer from "multer";
import fs from 'fs'
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const directoryPath = path.join(__dirname, '../assets/images/')

const multerStorage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true })
                console.log('directoryPath created', directoryPath)
            }
           
            cb(null, path.join(directoryPath))
        },
        filename: function (req, file, cb) {
            cb(null, (file.originalname=Date.now()+file.originalname))
        }
    }
)



const fileFilter = (req, file, cb) => {
    console.log(file.mimetype);
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        console.log(1);
        cb(null, true)
    }
    else {
        cb({ message: 'unsupported file format' }, false)
    }
}

export const upload = multer(

    {
        storage: multerStorage,
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: fileFilter
    }
)

