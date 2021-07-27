const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = (req, res, next) => {
  try {
    // recupere token du header d'authentification
    const token = req.headers.authorization.split(' ')[1];
    // decode le jeton
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};