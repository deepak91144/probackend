const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const userRoutes = require("./routes/User");
const productRoutes = require("./routes/Product");
const categoryRoutes = require("./routes/Category");
const reviewRoutes = require("./routes/Review");
const paymentRoutes = require("./routes/Payment");
const orderRoutes = require("./routes/Order");
// regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookies and file midlleware
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
// swagger docs route
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// morag middleware
app.use(morgan("tiny"));
app.use("/api/v1", userRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", reviewRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", orderRoutes);
app.use;
module.exports = app;
