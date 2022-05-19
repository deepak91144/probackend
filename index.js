const app = require("./app");
require("dotenv").config();
const connectWithDb = require("./config/Db");
const cloudinary = require("cloudinary");
// connect with database
connectWithDb();
// config for cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.listen(process.env.PORT, () => {
  console.log(`server is running at ${process.env.PORT}`);
});
