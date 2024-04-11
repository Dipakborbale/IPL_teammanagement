const mongoose = require('mongoose');

const schema = mongoose.Schema;
let mySchema = new schema({
    name: {
        type: String,
        required: true // Ensure name is required
    },
    Country: {
        type: String,
        required: true // Ensure Country is required
    },
    Age: {
        type: Number,
        required: true // Ensure Age is required
    },
    Role: {
        type: String,
        required: true // Ensure Role is required
    },
    teamName: {
        type: String,
        required: true // Ensure teamName is required
    },
    image: {
        type: String // Assuming you will store image URLs
    },
});

module.exports = mongoose.model('myuserData', mySchema);
