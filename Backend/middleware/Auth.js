const { User } = require('../models/User');

async function isAuthenticated(req, res, next) {
  if (!req.session.isLoggedIn) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access" });
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in isAuthenticated middleware:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = isAuthenticated;
