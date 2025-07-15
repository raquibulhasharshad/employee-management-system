import multer from "multer";
import path from "path";
import fs from 'fs';

const uploadsDir=path.join(__dirname, '../../uploads');
if(!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

const storage=multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, uploadsDir);
    },

    filename:(req, file, cb)=>{
        const uniqueSuffix=Date.now() + '-' + Math.round(Math.random()* 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

const fileFilter=(req:any, file:Express.Multer.File, cb:multer.FileFilterCallback)=>{
    const allowedTypes= /jpeg|jpg|png|gif/;
    const ext= path.extname(file.originalname).toLowerCase();
    const mime= file.mimetype;


    if(allowedTypes.test(ext)&& allowedTypes.test(mime)){
        cb(null, true);
    }
    else{
        cb(new Error("Only image files are required"));
    }
}

const uploads= multer({
    storage,
    limits:{fileSize: 5*1024*1024},
    fileFilter
});

export default uploads;
