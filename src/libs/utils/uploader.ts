import path from "path";
import multer from "multer";
import { v4 } from "uuid";


/** Multi image uploader Universal */
function getTargetImageStore(adress: any) {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./uploads/${adress}`);
        },
        filename: function (req, file, cb) {
            console.log(file);
            // path orqali fayl nomini ext ni olyapmiz m: .jpg, .pdf kabi
            const extension = path.parse(file.originalname).ext;
            const random_name = v4() + extension; // nomiga random nom berib ext ni qoshyapmiz. 
            cb(null, `${file.originalname}_${random_name}`);
        },
    });
};

const makeUploader = (adress: string) => {
    const storage = getTargetImageStore(adress);
    return multer({ storage: storage });
}

export default makeUploader;





