const express = require("express");
const mongoose=require("mongoose");
const app =express();
require('express-async-errors');
const port=3000;
const postrouter=require("./routes/posts");
const userrouter=require("./routes/user");
const cors=require("cors");
const AppError = require("./utils/AppError");
const logger = require("./utils/logger");
const dotenv = require("dotenv");

dotenv.config();

app.use(cors());
app.use(express.json());
app.use((req,res,next)=>{
    console.log("middleware running");
    next();
})
app.use("/api/v1/posts",postrouter);
app.use("/api/v1/users",userrouter);

//global error middlware
app.use((err, req, res, next) => {

    logger.error(`Error: ${err.message}, Status Code: ${err.statusCode || 500}`);
    res.status(err.statusCode || 500).send({ message: err.message || "An unexpected error occurred" });
});

// mongoose.connect("mongodb://localhost:27017/postSystem")
//     .then(() => {
//         app.listen(port, () => {
//             console.log("Server is running");
//         });
//     })
//     .catch(err => {
//         logger.error(`Database connection error: ${err.message}`);
//     });


    mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    logger.info("Connected to MongoDB Server");
    app.listen(process.env.PORT, () => {
      logger.info(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Failed to connect to MongoDB", err);
  });


