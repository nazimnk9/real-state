// import express from "express";
// import morgan from "morgan";
// import cors from "cors";
// import mongoose from "mongoose";
// import { DATABASE } from "./config.js";
// import authRoutes from "./routes/auth.js";
// import bodyParser from "body-parser";
// import adRoutes from "./routes/ad.js"
// const app = express();

// //db
// mongoose.set("strictQuery", false);
// mongoose
//     .connect(DATABASE)
//     .then(() => console.log("DB_CONNECTED"))
//     .catch((err) => console.log(err));


// //middlewares
// app.use(express.json({ limit: "10mb" })); // Increase limit if base64 strings are large
// //app.use(express.urlencoded({limit: '10mb', extended: true}));
// app.use(morgan("dev"));

// app.use(cors());
// // Middleware
// // app.use(cors());
// // app.use(express.json({ limit: "10mb" })); // Parse incoming JSON requests
// // app.use(bodyParser.urlencoded({ extended: true })); // Support URL-encoded bodies
// // app.use(filterSensitiveData);
// //routes middleware
// app.use("/api", authRoutes);
// app.use("/api", adRoutes);

// app.listen(8000, () => console.log("server_running_on_port_8000"));

import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import { DATABASE } from "./config.js";
import authRoutes from "./routes/auth.js";
import bodyParser from "body-parser";
import adRoutes from "./routes/ad.js";

const app = express();

// Database Connection
mongoose.set("strictQuery", false);
mongoose
  .connect(DATABASE)
  .then(() => console.log("DB_CONNECTED"))
  .catch((err) => console.log(err));

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" })); // Parses JSON payloads
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true })); // Parses URL-encoded payloads

// app.use((req, res, next) => {
//     // console.log(`Incoming request: ${req.method} ${req.url}`);
//     // console.log("Headers:", req.headers);
//     console.log("Request received in controller:", req);
//     console.log("Body1:", req.body);
//     next();
//   });

// Routes Middleware
app.use("/api", authRoutes);
app.use("/api", adRoutes);

// Start the server
app.listen(8000, () => console.log("server_running_on_port_8000"));