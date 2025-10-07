// dependencies------------------------------
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const port = process.env.PORT || 3001;
// database connection ----------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error("DB connection failed:", err));

// express app setup -----------------------
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup to allow frontend with cookies
const allowedOrigins = [
  "http://localhost:3000",
  "https://flavrsavrapp.netlify.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // allow cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  })
);

// routes -----------------------------------

// claude.js
const claudeRouter = require("./routes/claude");
app.use("/claude", claudeRouter);

// auth
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

// user
const userRouter = require("./routes/user");
app.use("/user", userRouter);

// test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working!" });
});

// Start server ------------------
app.listen(port, () => {
  console.log("App running on port ", port);
});
