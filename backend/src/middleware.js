// admin only
async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    req.user = {
      email: payload.email,
      name: payload.name,
      googleId: payload.sub,
      role: 'admin',
      canAdd: true,
    };

    next();
  } catch (err) {
    console.error('Admin Auth Error:', err);
    return res.sendStatus(403);
  }
}

// Admin or assistant
async function requireAdminOrAssistant(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  // Try Google SSO first (admin)
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    req.user = {
      email: payload.email,
      name: payload.name,
      googleId: payload.sub,
      role: 'admin',
      canAdd: true,
    };

    return next();
  } catch {
    console.log("Not admin... checking assistant privileges now")
  }

  // Try JWT (assistant)
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    if (user.role !== 'assistant') return res.sendStatus(403);
    req.user = user;
    return next();
  });
}

module.exports = {
  requireAdmin,
  requireAdminOrAssistant
}