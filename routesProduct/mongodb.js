require('dotenv').config();
const mongoose = require('mongoose');
const MONGO_UIR = process.env.MONGO_UIR;
const connectToMongoDB = () => {
mongoose.connect(MONGO_UIR) 
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB",err));}


module.exports = connectToMongoDB;
