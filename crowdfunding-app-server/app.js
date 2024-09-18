// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db/index");


// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const campaignsRoutes = require("./routes/campaign.routes");
app.use("/api", campaignsRoutes);

const commentsRoutes = require("./routes/comments.routes");
app.use("/api", commentsRoutes); 

const donationsRoutes = require("./routes/donations.routes");
app.use("/api", donationsRoutes);

const institutionsRoutes = require("./routes/institutions.routes");
app.use("/api", institutionsRoutes);

const userRoutes = require("./routes/user.routes");
const { isAuthenticated } = require("./middleware/jwt.middleware");

app.get("/api/user/:id", isAuthenticated)

app.use("/api", userRoutes);

app.get("/api/user/:id/campaign", isAuthenticated)

app.get("/api/user/:id/campaign/:id/donations", isAuthenticated)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);



//cloudinary
//const cloudinary = require('./utils/cloudinary.js');
//app.use = (cloudinary);

// File uploads
//const fileUpload = require('express-fileupload');
//app.use = (fileUpload());


module.exports = app;
