const mongoose = require("mongoose");

const ConnectToDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDb connected successfully')
    } catch(e) {
        console.error('MongoDb connection failed')
        process.exit(1)
    }
}

module.exports = ConnectToDB;