
module.exports = function (req, res, next) {
    try {
        
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }

        if (req.user.role !== "admin") {
            return res.status(403).send("Access denied. Admin only.");
        }

        next();
    } catch (err) {
        console.error("Admin check failed:", err);
        return res.status(500).send("Server error");
    }
};