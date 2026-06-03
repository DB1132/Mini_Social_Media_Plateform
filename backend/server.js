const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const dbconnect = require('./config/db');

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");
const followRoutes = require("./routes/followRoutes");

const app = express();


dotenv.config();
dbconnect();

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/api/auth",authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts", likeRoutes);
app.use("/api/posts", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", followRoutes);



/*
  THIS LINE CONNECTS:
  URL: /app
  FOLDER: backend/public/app/dist (built React app)
*/
app.use(
  "/app",
  express.static(path.join(__dirname, "public/app/dist"))
);

// React routing support (use regex to avoid path-to-regexp wildcards)
app.get(/^\/app\/.*$/, (req, res) => {
  res.sendFile(
    path.join(__dirname, "public/app/dist/index.html")
  );
});

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log("Server Starting .....");
});