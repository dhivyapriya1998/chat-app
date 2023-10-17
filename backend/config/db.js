const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDb connect ${connect.connection.host}`.cyan);
  } catch (error) {
    console.log(error,"error");
    process.exit();
  }
};

module.exports = connectDB;
