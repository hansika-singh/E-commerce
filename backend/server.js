const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

// CONFIG
dotenv.config();

// DATABASE
const db = require("./config/db");

// APP
const app = express();

// MIDDLEWARE
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);

// ROUTES
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

// API ROUTES
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// HOME ROUTE
app.get("/", (req, res) => {
    res.send("E-Commerce Backend Running 🚀");
});

// 404 HANDLER
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

// SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});