export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ status: 'error', message: 'Admin only' });
  }
  next();
};

export const userOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'user') {
    return res.status(403).json({ status: 'error', message: 'User only' });
  }
  next();
};
