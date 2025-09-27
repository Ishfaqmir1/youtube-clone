import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user object (without password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ error: "User not found" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  }

  if (!token) {
    return res.status(401).json({ error: "No token, not authorized" });
  }
};
