// middleware/isSuperAdmin.js

module.exports = function (req, res, next) {
    try {
        // assuming req.user is set by auth middleware
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }

        if (req.user.role !== "superAdmin") {
            return res.status(403).send("Access denied. Super Admin only.");
        }

        next();
    } catch (err) {
        console.error("SuperAdmin check failed:", err);
        return res.status(500).send("Server error");
    }
};