const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check for token in header
    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
      // Format: "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Get user from token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found'
      });
    }

    // 4. Attach user to request object
    req.user = user;
    next(); // Continue to next middleware/controller

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};