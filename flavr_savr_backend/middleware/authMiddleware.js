const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  // Check cookie first, then Authorization header
  const cookieToken = req.cookies.accessToken;
  const authHeader = req.headers["authorization"];
  const headerToken = authHeader && authHeader.split(" ")[1];

  const token = cookieToken || headerToken;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
