// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();
const cors = require("cors");
app.use(cors({origin: "http://localhost:5173"}));

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const campaignsRoutes = require("./routes/campaign.routes");
app.use("/api", campaignsRoutes);

/* const commentRoutes = require("./routes/comment.routes");
app.use("/api", commentRoutes); */

const donationsRoutes = require("./routes/donations.routes");
app.use("/api", donationsRoutes);

const institutionsRoutes = require("./routes/institutions.routes");
app.use("/api", institutionsRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/api", userRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
