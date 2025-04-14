const multer = require("multer")

const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, "./public/")
  },
  filename: (req,file,cb) => {
    cb(null, file.originalname)
  }
})

const upload = (type = 'image') => {

  let allowed = []

  if (type === 'image') {
    allowed = ['jpg','jpeg','png','gif','svg','webp', 'bmp']
  } else if (type === 'doc') {
    allowed = ['doc','pdf','ppt','csv','xlsx','txt','json']
  }
  
  return multer({
    storage: storage,
    fileFilter: (req,file,cb) => {
      let ext = file.originalname.split(".").pop()
      if (allowed.includes(ext)) {
        cb(null, true)
      } else {
        cb({
          code: 400,
          message: "File format not supported",
          status: "INVALID_FILE_FORMAT",
          detail: "" // come back to this later on in the project
        })
      }
    },
    limits: {
      fileSize: 5000000
    }
  })
}

module.exports = upload