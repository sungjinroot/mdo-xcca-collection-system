const express = require('express');
const pool = require("./db");
const app = express();
const cors = require('cors');


app.use(express.json()); 

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000', 
    'http://127.0.0.1:5173' 
  ]
}));


/* JWT middleware for all */
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  //SSO
  try {
    const decoded = jwt.decode(token, { complete: true });
    const issuer = decoded?.payload?.iss;

    if (issuer === 'https://accounts.google.com' || issuer === 'accounts.google.com') {
      const client = new OAuth2Client("1004129401046-42tsa627e6q856qqrbghtiue4kouvfgv.apps.googleusercontent.com"); //USE ENVIRONMENT VARS
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID || "1004129401046-42tsa627e6q856qqrbghtiue4kouvfgv.apps.googleusercontent.com",
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

    //NON SSO
    } else {

      jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
      });
    }
  } catch (err) {
    console.error('Auth error:', err);
    return res.sendStatus(403);
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    if (!allowedRoles.includes(req.user.role)) return res.sendStatus(403);
    next();
  };
}

//Routes to Upload Folder
app.use('/uploads', express.static('/app/uploads'));

const artifactEndpoint = require('./endpoints/artifacts');
const artifactDisplayEndpoint = require('./endpoints/artifactsdisplay');
const roomEndpoint = require('./endpoints/rooms');
const categoriesEndpoint = require('./endpoints/categories');
const usersEndpoint = require('./endpoints/users');
const authEndpoint = require('./endpoints/auth');
const roomCleanupEndpoint = require('./endpoints/room-picturecleanup');
const downloadEndpoint = require('./endpoints/download');

app.use('/api/v1/artifacts',artifactEndpoint);
app.use('/api/v1/artifactsdisplay', artifactDisplayEndpoint);
app.use('/api/v1/download', downloadEndpoint);
app.use('/api/v1/auth', authEndpoint);
app.use('/api/v1/rooms', roomEndpoint);
app.use('/api/v1/categories', categoriesEndpoint);
app.use('/api/v1/users', usersEndpoint);
/*app.use('/api/v1/rooms', roomCleanupEndpoint);*/

//AALV endpoints
const uploadEndpoint = require('./endpoints/upload');
const imageEndpoint = require('./endpoints/artifactImages');
const changeThumbnail = require('./endpoints/changeThumbnail');
const changeRoom = require('./endpoints/changeRoom');
const artifactCategories = require('./endpoints/artifactCategories');


//AALV endpoints
app.use('/api/v1/upload/',uploadEndpoint);
app.use('/api/v1/images/', imageEndpoint);
app.use('/api/v1/thumbnail', changeThumbnail);
app.use('/api/v1/changeroom',changeRoom);
app.use('/api/v1/artifact/categories',artifactCategories);


/*Ping Database*/
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT 1");
        res.json({ message: "Database is running" });
    } catch (err) {
        console.error(err);
        res.status(500).send("DB FAILED");
    }
});

module.exports = app;