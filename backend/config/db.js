const mongoose = require("mongoose");
'MONGO_URI = mongodb+srv://dhivyaravi98:dhivyathelegend@dp-cluster.haskn47.mongodb.net/?retryWrites=true&w=majority'

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDb connected in  ${connect.connection.host}`.cyan);
  } catch (error) {
    console.log(error,"error");
    process.exit();
  }
};

module.exports = connectDB;
