const mongoose = require("mongoose");

const ConnectToDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB connected successfully')
    } catch(e) {
        console.error('MongoDB connection failed', e.message)
        process.exit(1)
    }
}

module.exports = ConnectToDB;