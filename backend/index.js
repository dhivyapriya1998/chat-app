// web framework for connecting wih server
const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
var colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const {notFound,errorHandler} = require("./middleware/errorMiddleware")

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.use(notFound);
app.use(errorHandler);

app.get("/ping",(req,res)=>{
  res.send("Ping")
})

app.use("/api/user", userRoutes);

app.get("/api/chats", (req, res) => {
  res.send(chats);
});

app.get("/api/chats/:id", (req, res) => {
  singleRecord = chats.find((record) => record._id === req.params.id);
  res.send(singleRecord);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on ${PORT}`.yellow));
