const multer = require('multer');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name as the new file name
    }
});

const upload = multer({ 
    storage: storage, // Use the defined storage configuration
    limits: { fileSize: 1024 * 1024 * 1.2 }, // Limit file size to 1.2MB
});

module.exports = upload;
