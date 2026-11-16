const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const apiApp = require("./src/app");

const app = express();

let connectionPromise = null;

app.use(async (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1 && !connectionPromise) {
            connectionPromise = connectDB().catch((error) => {
                connectionPromise = null;
                throw error;
            });
        }

        if (connectionPromise) {
            await connectionPromise;
        }

        next();
    } catch (error) {
        console.error("DATABASE CONNECTION ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Database connection failed."
        });
    }
});

app.use(apiApp);

module.exports = app;
