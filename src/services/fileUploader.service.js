const CloudinaryService = require("./cloudinary.service")

class FileUploaderService extends CloudinaryService {

}

const fileUploadSvc= new FileUploaderService()
module.exports = fileUploadSvc