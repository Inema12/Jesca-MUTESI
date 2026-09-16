// This middleware checks that a valid JWT was sent with the request.
// If it's missing, invalid, or expired, we stop the request here
// and send back a clear error instead of letting it reach the route.

const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  // Expected format: "Authorization: Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach the decoded user info (id, role) to the request
    // so later route handlers know who is making the request.
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
