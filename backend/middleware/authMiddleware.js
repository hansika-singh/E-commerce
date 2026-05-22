// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
}

const authMiddleware = (req, res, next) => {
    try {
        const authHeader =
            req.headers.authorization;

        // CHECK TOKEN EXISTS
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        // CHECK BEARER FORMAT
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Bearer token required"
            });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format"
            });
        }

        // VERIFY TOKEN
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // ATTACH USER
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    } catch (error) {
        console.error("AUTH ERROR:", error);
        return res.status(401).json({
            success: false,
            message:
                error.message === "jwt expired"
                    ? "Token expired"
                    : "Unauthorized access"
        });
    }
};

module.exports = authMiddleware;